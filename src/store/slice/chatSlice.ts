import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { config } from '../../config/config';
import { apiClient } from '@/src/api/axios';
import { fetchUserInfo } from '@/src/store/slice/auth/userThunks';
import { User } from '@/src/store/User';

// Interfaces
interface ApiResponse<T> {
    data: T;
}

interface Message {
    type: string;
    chatroom_id: string;
    sender_id: string;
    content: string;
    message_id: string;
    timestamp: string;
    limit: number | null;
    offset: number | null;
	last_read_message_id: string | null;
}

interface Profile {
    id: number;
    name: string;
    avatar: string;
}

interface ChatState {
    messages: Record<string, Message[]>;
    connected: boolean;
    ws: WebSocket | null;
    senderId: string | null;
    profiles: Record<string, Profile>;
    unreadCounts: Record<string, number>;
    totalUnreadCount: number;
    last_read_message_ids: Record<string, string>; 
	activeChatroomId: string;
}

const initialState: ChatState = {
    messages: {},
    connected: false,
    ws: null,
    senderId: null,
    profiles: {},
    unreadCounts: {},
    totalUnreadCount: 0,
    last_read_message_ids: {}, 
	activeChatroomId: '',
};

// WebSocket connection helper
const connectWebSocket = (dispatch: any, getState: any): WebSocket => {
    const senderId = getState().chat.senderId;

    if (!senderId) {
        throw new Error("Sender ID is required before establishing WebSocket connection.");
    }

    const ws = new WebSocket(`${config.wsBaseURL}/chat/ws`);

    ws.onopen = () => dispatch(setConnected(true));

    ws.onmessage = (event: MessageEvent) => {
        const message: Message = JSON.parse(event.data);

        if (!message.type) {
            try {
                const chatrooms = Array.isArray(message) ? message : [message];
                chatrooms.forEach((room: any) => {
                    const profile: Profile = {
                        id: parseInt(room.chatroom_id),
                        name: room.name,
                        avatar: 'default_avatar_url'
                    };
					// Check if the profile already exists
					if (!getState().chat.profiles[room.chatroom_id]) {
						// If not, add it to the state
                    	dispatch(addProfile({ chatroomId: room.chatroom_id, profile }));
						dispatch(setlastMessageId({ chatroomId: room.chatroom_id, messageId: room.last_read_message_id }));
						dispatch(sendHistory(room.chatroom_id));
					}
                });
            } catch (err) {
                console.error("Error parsing chatroom data:", err);
            }
            return;
        }
		else{
			const { chatroom_id, message_id } = message;
			const state = getState().chat;
			const activeChatroomId = state.activeChatroomId;

			dispatch(addMessage(message));

			if (activeChatroomId == chatroom_id) {
				dispatch(sendRead(chatroom_id));
				dispatch(setlastMessageId({ chatroomId: chatroom_id, messageId: message_id }));
				dispatch(clearUnreadCount(chatroom_id)); 
			}
		}
    };

    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => dispatch(setConnected(false));

    return ws;
};

// Redux slice
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConnected(state, action: PayloadAction<boolean>) {
            state.connected = action.payload;
        },
        addMessage(state, action: PayloadAction<Message>) {
			const message = action.payload;
			const { chatroom_id, message_id, sender_id, type } = message;

			if (!state.messages[chatroom_id]) {
				state.messages[chatroom_id] = [];
			}

			// ✅ Skip messages that are empty from history
			if (message.content === '') {
				return;
			}
			
			const exists = state.messages[chatroom_id].some(m => m.message_id == message_id);

			if (!exists) {
				state.messages[chatroom_id].push(message);
				// ✅ Sort messages after inserting by message_id (you can change this to timestamp if needed)
				state.messages[chatroom_id].sort((a, b) => parseInt(a.message_id) - parseInt(b.message_id));
				const lastReadStr = state.last_read_message_ids[chatroom_id] || "0";
				const lastRead = parseInt(lastReadStr);
				const currentMsgId = parseInt(message_id);

				if ((Number.isNaN(currentMsgId) || currentMsgId > lastRead) && sender_id !== state.senderId) {
				state.unreadCounts[chatroom_id] = (state.unreadCounts[chatroom_id] || 0) + 1;
				state.totalUnreadCount += 1;
				}

			}
		},
        addProfile(state, action: PayloadAction<{ chatroomId: string; profile: Profile }>) {
            const { chatroomId, profile } = action.payload;
            state.profiles[chatroomId] = profile;
        },
		setlastMessageId(state, action: PayloadAction<{ chatroomId: string; messageId: string }>) {
			const { chatroomId, messageId } = action.payload;
			state.last_read_message_ids[chatroomId] = messageId;
		},
		setActiveChatroomId(state, action: PayloadAction<string>) {
			console.log('setActiveChatroomId:', action.payload);
			state.activeChatroomId = action.payload;
		},
        setWebSocket(state, action: PayloadAction<WebSocket | null>) {
            state.ws = action.payload;
        },
        setSenderId(state, action: PayloadAction<string>) {
            state.senderId = action.payload;
        },
        clearUnreadCount(state, action: PayloadAction<string>) {
            const chatroomId = action.payload;
            state.totalUnreadCount -= state.unreadCounts[chatroomId] || 0;
            state.unreadCounts[chatroomId] = 0;
        },
    }
});

// Async thunks
export const initializeWebSocket = () => async (dispatch: any, getState: any) => {
    if (getState().chat.connected) return getState().chat.ws;

    let senderId = getState().chat.senderId;

    if (!senderId) {
        const action = await dispatch(fetchUserInfo());
        const userInfo = action.payload as ApiResponse<User>;
        senderId = userInfo.data.id;
        dispatch(setSenderId(senderId));
    }

    const ws = connectWebSocket(dispatch, getState);
    dispatch(setWebSocket(ws));
    return ws;
};

export const createChatroom = (userId: string, userName: string) => async (dispatch: any, getState: any) => {
    const { senderId } = getState().chat;

    const payload = {
        name: userName,
        members: [senderId?.toString(), userId.toString()],
        is_private: false,
    };

    try {
        const response = await apiClient.post('chat/create', payload);
        return response.data;
    } catch (error: any) {
        console.error('Error creating chatroom:', error.message);
        throw error;
    }
};

export const sendStart = () => async (dispatch: any, getState: any) => {
    let { ws, senderId } = getState().chat;

    if (!senderId) throw new Error("Sender ID is required.");

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        ws = await dispatch(initializeWebSocket()) as WebSocket;
        await new Promise<void>((resolve) => { ws!.onopen = () => resolve(); });
    }

    const message = {
        type: "start",
        chatroom_id: "0",
        sender_id: senderId.toString(),
        content: "",
        message_id: "",
        timestamp: new Date().toISOString(),
        limit: 20,
        offset: 0
    };
	
    ws.send(JSON.stringify(message));
};

export const sendMessage = (chatroomId: string, content: string) => (dispatch: any, getState: any) => {
    const { ws, connected, senderId } = getState().chat;

    if (!senderId) throw new Error("Sender ID is required.");

    const message: Message = {
        type: "message",
        chatroom_id: chatroomId,
        sender_id: senderId.toString(),
        content,
        message_id: "",
        timestamp: new Date().toISOString(),
        limit: 20,
        offset: 0,
		last_read_message_id: ""
    };

	const history: Message = {
		type: "history",
		chatroom_id: chatroomId,
		sender_id: senderId.toString(),
		content: "",
		message_id: "",
		timestamp: new Date().toISOString(),
		limit: 1,
		offset: 0,
		last_read_message_id: ""
	};

    if (ws && connected) {
        ws.send(JSON.stringify(message));
		ws.send(JSON.stringify(history));
        // dispatch(addMessage(message));
    } else {
        console.log('WebSocket not connected');
    }
};

export const sendHistory = (chatroomId: string) => (dispatch: any, getState: any) => {
    const { ws, connected, senderId } = getState().chat;

    if (!senderId) throw new Error("Sender ID is required.");

    const message = {
        type: "history",
        chatroom_id: chatroomId,
        sender_id: senderId.toString(),
        content: "",
        message_id: "",
        timestamp: new Date().toISOString(),
        limit: 20,
        offset: 0,
    };
	
    if (ws && connected) {
        ws.send(JSON.stringify(message));
    } else {
        console.log('WebSocket not connected');
    }
};

export const sendRead = (chatroomId: string) => (dispatch: any, getState: any) => {
    const { ws, connected, senderId, messages } = getState().chat;

    if (!senderId) throw new Error("Sender ID is required.");

    const chatMessages: Message[] = messages[chatroomId] || [];
    if (chatMessages.length === 0) {
        console.log(`No messages in chatroom ${chatroomId} to send read receipt.`);
        return;
    }

    const lastMessage = chatMessages.reduce((latest: Message, current: Message) => {
        return current.message_id > latest.message_id ? current : latest;
    });

    const message = {
        type: "read",
        chatroom_id: chatroomId,
        sender_id: senderId.toString(),
        content: "",
        message_id: lastMessage.message_id,
        timestamp: new Date().toISOString(),
        limit: 20,
        offset: 0,
    };

    console.log('sendRead:', message);
    if (ws && connected) {
        ws.send(JSON.stringify(message));
		dispatch(setlastMessageId({ chatroomId, messageId: lastMessage.message_id }));
		dispatch(clearUnreadCount(chatroomId));
    } else {
        console.log('WebSocket not connected');
    }
};

export const getPagination = () => (dispatch: any, getState: any) => {
    const { ws, connected, senderId, activeChatroomId, messages } = getState().chat;

    if (!senderId) throw new Error("Sender ID is required.");
    if (!activeChatroomId) throw new Error("Active Chatroom ID is required.");

    const chatroomMessages = messages[activeChatroomId] || [];
    const offset = chatroomMessages.length;

    const message = {
        type: "history",
        chatroom_id: activeChatroomId,
        sender_id: senderId.toString(),
        content: "",
        message_id: "",
        timestamp: new Date().toISOString(),
        limit: 20,
        offset: offset,
    };
	console.log('getPagination:', message);
    if (ws && connected) {
        ws.send(JSON.stringify(message));
    } else {
        console.log('WebSocket not connected');
    }
};

// Export actions and reducer
export const { setConnected, addMessage, addProfile, setlastMessageId, setWebSocket, setSenderId, clearUnreadCount, setActiveChatroomId  } = chatSlice.actions;
export default chatSlice.reducer;
