import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { error } from 'console';

interface Message {
	sender_id: number;
	receiver_id: number;
	content: string;  // Optional, add based on your actual message format
}

interface ChatState {
	messages: Message[];
	connected: boolean;
	ws: WebSocket | null;
	senderId: number | null
}

const initialState: ChatState = {
	messages: [],
	connected: false,
	ws: null,
	senderId: null
};

const connectWebSocket = (dispatch: any, senderId: number): WebSocket => {
	const receiverID = 2 // hard-peace

	// You can pass the token in the URL or use it after connection
	const ws = new WebSocket(`ws://localhost:5000/api/v2/chat/ws?senderID=${senderId}&receiverID=${receiverID}`);

	ws.onopen = () => {
		console.log('WebSocket connected');
		dispatch(setConnected(true));
	};

	ws.onmessage = (event: MessageEvent) => {
		const message: Message = JSON.parse(event.data);
		console.log('this is message from socket:', message)
		dispatch(addMessage(message));  // Add message to Redux store
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
			state.ws = action.payload; // Store the WebSocket connection in the state
		},
		setSenderId(state, action: PayloadAction<number>) {  // New reducer to set senderId
			state.senderId = action.payload;
		},
	},
});

// Async action to initialize WebSocket connection
export const initializeWebSocket = () => (dispatch: any, getState: any) => {
	const { senderId } = getState().chat
	if (senderId === null) {
		console.error('senderId is null, from chatSlice')
	}
	const ws = connectWebSocket(dispatch, senderId);
	dispatch(setWebSocket(ws));
};

export const sendMessage = (message: Message) => (dispatch: any, getState: any) => {
	const { ws, connected } = getState().chat;

	if (ws && connected) {
		// Send the message over the WebSocket
		ws.send(JSON.stringify(message));

		// Dispatch to add the message to Redux store
		dispatch(addMessage(message));
	} else {
		console.log("WebSocket is not connected");
	}
};

// Export actions
export const { setConnected, addMessage, setWebSocket, setSenderId } = chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
