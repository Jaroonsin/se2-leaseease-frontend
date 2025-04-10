import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { config } from '../../config/config';
import { apiClient } from '@/src/api/axios';
import { fetchUserInfo } from '@/src/store/slice/auth/userThunks';
import { User } from '@/src/store/User';

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
    limit: null | number;
    offset: null | number;
}

interface Profiles {
	id: number;
	name: string;
	avatar: string;
}

interface ChatState {
	messages: { [chatroomId: string]: Message[] }; // updated here
	connected: boolean;
	ws: WebSocket | null;
	senderId: string | null;
	profiles: { [chatroomId: string]: Profiles };
	unreadCounts: { [chatroomId: string]: number };
	totalUnreadCount: number;
}

const initialState: ChatState = {
	messages: {}, // changed from [] to {}
	connected: false,
	ws: null,
	senderId: null,
	profiles: {},
	unreadCounts: {},
	totalUnreadCount: 0,
};

// Modify WebSocket connection logic to use `getState` from thunk
const connectWebSocket = (dispatch: any, getState: any): WebSocket => {
	const state = getState();
	const sender_id = state.chat.senderId;

	if (!sender_id) {
		console.error("senderId is null in connectWebSocket");
		throw new Error("senderId is required");
	}

    const ws = new WebSocket(`${config.wsBaseURL}/chat/ws`);

    ws.onopen = () => {
        console.log('WebSocket connected');
        dispatch(setConnected(true));
    };

    ws.onmessage = (event: MessageEvent) => {
        const message: Message = JSON.parse(event.data);
        console.log('this is message from socket:', message);

        // Access Redux state here (within the correct context of the thunk)
        const { messages } = getState().chat;

        // Handle case where type is null or undefined
		if (!message.type) {
			try {
				// If the message is a single object, wrap it in an array
				const raw = Array.isArray(message) ? message : [message];

				raw.forEach((chatroom: any) => {
					const profile = {
						id: parseInt(chatroom.chatroom_id),
						name: chatroom.name,
						avatar: 'default_avatar_url' // You can update this
					};
					dispatch(addProfile({ chatroomId: chatroom.chatroom_id, profile }));
				});
			} catch (err) {
				console.error("Error processing user list message:", err);
			}
			return; // Skip normal message handling
		} else  {
			dispatch(addMessage(message));
		}
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket closed');
        dispatch(setConnected(false));
    };

    return ws;
};

// Create the slice
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConnected(state, action: PayloadAction<boolean>) {
            state.connected = action.payload;
        },
        addMessage(state, action: PayloadAction<Message>) {
			console.log('this is addMessage from chatSlice:', action.payload);
			const message = action.payload;
			const chatroomId = message.chatroom_id;
		
			if (!state.messages[chatroomId]) {
				state.messages[chatroomId] = [];
			}
		
			// Prevent duplicates by message_id
			const exists = state.messages[chatroomId].some(m => m.message_id === message.message_id);
			if (!exists) {
				state.messages[chatroomId].push(message);
			}
		
			// Only increment unread count if the message is from another user
			if (message.sender_id != state.senderId && message.type != 'history') {
				state.unreadCounts[chatroomId] = (state.unreadCounts[chatroomId] || 0) + 1;
				state.totalUnreadCount += 1;
			}
		},
		addProfile(state, action: PayloadAction<{ chatroomId: string; profile: Profiles }>) {
			const { chatroomId, profile } = action.payload;
			state.profiles[chatroomId] = profile;
		},
		// Add other reducers as needed		
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
    },
});

// Async action to initialize WebSocket connection
export const initializeWebSocket = () => async (dispatch: any, getState: any) => {
    try {
		if(getState().chat.connected) {
			console.log('WebSocket already connected, skipping initialization.');
			return;
		}
        // Fetch user info and get user data
        const action = await dispatch(fetchUserInfo());
        const userInfo = action.payload as ApiResponse<User>;

        // Set sender ID in the state
        dispatch(setSenderId(userInfo.data.id));

        // Initialize WebSocket connection after setting the sender ID
        connectWebSocket(dispatch, getState);
        
        // Dispatch any other necessary actions here, if needed
        dispatch(initializeWebSocket());

    } catch (error) {
        console.error('Error initializing WebSocket:', error);
        // Optionally dispatch error handling action if necessary
    }
};

// Open Chatroom
export const openChatroom = (chatroomId: string) => (dispatch: any, getState: any) => {
	const state = getState();
	const sender_id = state.chat.senderId;

	if (!sender_id) {
		console.error("senderId is null in connectWebSocket");
		throw new Error("senderId is required");
	}

    const { ws, connected } = getState().chat;


	const params1 = {
		type: "history",
		chatroom_id: chatroomId,
		sender_id: getState().chat.senderId.toString(),
		content: "",
		message_id: "",
		timestamp: new Date().toISOString(),
		limit: 20,
		offset: 0
	};
	const params2 = {
		type: "read",
		chatroom_id: chatroomId,
		sender_id: getState().chat.senderId.toString(),
		content: "",
		message_id: "",
		timestamp: new Date().toISOString(),
		limit: 20,
		offset: 0
	};
	// console.log('this is params from sendMessage:', params2);
	// console.log('this is ws from sendMessage:', ws);
	// console.log('this is connected from sendMessage:', connected);
	if (ws && connected) {
        // Send the message over the WebSocket
		ws.send(JSON.stringify(params1));
		ws.send(JSON.stringify(params2)); 
		dispatch(clearUnreadCount(chatroomId));
    } else {
        console.log('WebSocket is not connected');
    }
}

export const createChatroom = (user_id: string, user_name: string) =>
    async (dispatch: any, getState: any) => {
        const state = getState();
        const sender_id = state.chat.senderId;

        try {
            const payload = {
                name: user_name,
                members: [sender_id.toString(), user_id.toString()],
                is_private: false,
            };

            const response = await apiClient.post('chat/create', payload);

            console.log('Chatroom created:', response.data);
            return response.data;

        } catch (error: any) {
            console.error('Error creating chatroom:', error.message);
            throw error;
        }
    };

// sent start of the chatSlice
export const sendStart = () => async (dispatch: any, getState: any) => {
	const state = getState();
	const sender_id = state.chat.senderId;
	const { ws } = state.chat;

	if (!ws || ws.readyState !== WebSocket.OPEN) {
		initializeWebSocket();
	}

	if (!sender_id) {
		// Fetch user info and get user data
        const action = await dispatch(fetchUserInfo());
        const userInfo = action.payload as ApiResponse<User>;
        dispatch(setSenderId(userInfo.data.id));
	}

	const params = {
		type: "start",
		chatroom_id: "0",
		sender_id: sender_id.toString(),
		content: "",
		message_id: "",
		timestamp: new Date().toISOString(),
		limit: 20,
		offset: 0
	};
	ws.send(JSON.stringify(params));
}

// Send message through WebSocket (no need to addMessage in this action)
export const sendMessage = (chatroom_id: string, content: string) => (dispatch: any, getState: any) => {
	const state = getState();
	const sender_id = state.chat.senderId;

	if (!sender_id) {
		console.error("senderId is null in connectWebSocket");
		throw new Error("senderId is required");
	}

    const { ws, connected } = getState().chat;

	const params = {
		type: "message",
		chatroom_id: chatroom_id,  
		sender_id: sender_id.toString(),
		content: content,  
		message_id: chatroom_id + new Date().toISOString(),  
		timestamp: new Date().toISOString(),
		limit: 20,
		offset: 1
	};
	// console.log('this is params from sendMessage:', params);
	// console.log('this is ws from sendMessage:', ws);
	// console.log('this is connected from sendMessage:', connected);
    if (ws && connected) {
        // Send the message over the WebSocket
        ws.send(JSON.stringify(params));
		dispatch(addMessage(params)); 
    } else {
        console.log('WebSocket is not connected');
    }
};

// Export actions
export const { setConnected, addMessage, addProfile, setWebSocket, setSenderId, clearUnreadCount} = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
