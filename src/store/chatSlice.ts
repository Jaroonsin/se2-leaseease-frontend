import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { config } from '../config/config';

interface Message {
    sender_id: number;
    receiver_id: number;
    content: string;
}

interface ChatState {
    messages: Message[];
    connected: boolean;
    ws: WebSocket | null;
    senderId: number | null;
}

const initialState: ChatState = {
    messages: [],
    connected: false,
    ws: null,
    senderId: null,
};

// Modify WebSocket connection logic to use `getState` from thunk
const connectWebSocket = (dispatch: any, senderId: number, receiverId: number, getState: any): WebSocket => {
    const ws = new WebSocket(`${config.wsBaseURL}/chat/ws?senderID=${senderId}&receiverID=${receiverId}`);

    ws.onopen = () => {
        console.log('WebSocket connected');
        dispatch(setConnected(true));
    };

    ws.onmessage = (event: MessageEvent) => {
        const message: Message = JSON.parse(event.data);
        console.log('this is message from socket:', message);

        // Access Redux state here (within the correct context of the thunk)
        const { messages } = getState().chat;

        // Prevent duplicates
        const messageExists = messages.some(
            (msg: Message) =>
                msg.content === message.content &&
                msg.sender_id === message.sender_id &&
                msg.receiver_id === message.receiver_id,
        );

        if (!messageExists) {
            dispatch(addMessage(message)); // Add message to Redux store
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
            state.messages.push(action.payload);
        },
        setWebSocket(state, action: PayloadAction<WebSocket | null>) {
            state.ws = action.payload;
        },
        setSenderId(state, action: PayloadAction<number>) {
            state.senderId = action.payload;
        },
    },
});

// Async action to initialize WebSocket connection with getState properly used
export const initializeWebSocket = (receiverId: number) => (dispatch: any, getState: any) => {
    const { senderId } = getState().chat;
    if (senderId === null) {
        console.error('senderId is null, from chatSlice');
        return;
    }
    const ws = connectWebSocket(dispatch, senderId, receiverId, getState); // Pass `getState`
    dispatch(setWebSocket(ws));
};

// Send message through WebSocket (no need to addMessage in this action)
export const sendMessage = (message: Message) => (dispatch: any, getState: any) => {
    const { ws, connected } = getState().chat;

    if (ws && connected) {
        // Send the message over the WebSocket
        ws.send(JSON.stringify(message));

        dispatch(addMessage(message));
    } else {
        console.log('WebSocket is not connected');
    }
};

// Export actions
export const { setConnected, addMessage, setWebSocket, setSenderId } = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
