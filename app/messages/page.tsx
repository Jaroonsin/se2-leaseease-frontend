'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, openChatroom, initializeWebSocket, sendStart } from '@/src/store/slice/chatSlice';
import { RootState, AppDispatch } from '@/src/store/store';
import Header from '@/app/users/dashboard/components/Header';

export default function Chat() {
    const dispatch = useDispatch<AppDispatch>();
    const [messageContent, setMessageContent] = useState<string>('');
    const { user } = useSelector((state: RootState) => state.user);
    const { messages, senderId } = useSelector((state: RootState) => state.chat);
    const profiles = useSelector((state: any) => state.chat.profiles);
    const unreadCounts = useSelector((state: any) => state.chat.unreadCounts);
    const [currentChatroomId, setCurrentChatroomId] = useState<string>('');

    useEffect(() => {
        const setup = async () => {
            await dispatch(initializeWebSocket());
            await dispatch(sendStart());
        };

        setup();
    }, [dispatch]);

    const handleChatroomClick = (chatroomId: string) => {
        setCurrentChatroomId(chatroomId);
        dispatch(openChatroom(chatroomId));
    };

    const handleSendMessage = () => {
        if (messageContent.trim() === '') return; // Don't send empty messages
        if (senderId == null) return;
        console.log('sender Id', senderId);

        setMessageContent('');
        dispatch(sendMessage(currentChatroomId, messageContent));
    };

    return (
        <div className="flex w-full h-full flex-col items-center rounded-md bg-white">
            <Header />
            <div className="flex justify-center items-center flex-1 self-stretch">
                <div className="flex flex-col h-[calc(100vh-4rem)] items-start gap-[0.5rem] self-stretch w-[23rem] p-[1rem] bg-slate-100 overflow-y-auto">
                    {Object.keys(profiles).map((chatroomId) => {
                        const profile = profiles[chatroomId];
                        const unreadCount = unreadCounts[chatroomId] || 0;
                        const isSelected = chatroomId === currentChatroomId; // You need to track this in your state

                        return (
                            <div
                                key={chatroomId}
                                className={`relative flex items-center gap-[1.25rem] self-stretch h-[5rem] p-[0.625rem] rounded-[0.25rem]
								${isSelected ? 'bg-blue-300' : 'bg-slate-200'}
								hover:cursor-pointer`}
                                onClick={() => handleChatroomClick(chatroomId)}
                            >
                                {/* Profile Image */}
                                <div className="w-[3.75rem] h-[3.75rem] rounded-full bg-[url('https://loremflickr.com/40/40?random=1')] bg-lightgray bg-[size:199.261%_100%] bg-no-repeat"></div>

                                {/* User Info */}
                                <div className="flex flex-col items-start flex-[1_0_0]">
                                    <div className="flex items-center gap-[0.25rem] self-stretch">
                                        <div className="max-w-[16.5rem] text-[var(--Slate-900, #0F172A)] text-sm font-medium leading-[1.25rem]">
                                            {profile.name}
                                        </div>
                                    </div>
                                </div>

                                {/* Unread badge */}
                                {unreadCount > 0 && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                                        {unreadCount}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-1 h-[calc(100vh-4rem)] p-[1rem] flex-col items-start gap-[0.625rem] self-stretch">
                    {currentChatroomId === '' ? (
                        // Loading Placeholder
                        <>
                            <div className="flex flex-col justify-center items-center flex-[1_0_0] self-stretch mt-[1rem] text-gray-500">
                                please select a chatroom
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col justify-between h-full w-full bg-slate-100 rounded-[0.5rem]">
                                {/* Top Bar */}
                                <div className="flex h-[5rem] items-center gap-[0.625rem] self-stretch p-[1rem] border-b-[3px] border-b-white">
                                    <div
                                        className="w-[2.5rem] h-[2.5rem] rounded-full bg-lightgray bg-[size:199.261%_100%] bg-no-repeat"
                                        style={{
                                            backgroundImage: user?.image_url
                                                ? `url(${user.image_url})`
                                                : "url('https://loremflickr.com/40/40?random=3')",
                                        }}
                                    ></div>
                                    <div className="flex flex-col items-start flex-[1_0_0] rounded-md text-sm font-medium leading-[1.25rem]">
                                        {user?.name || 'username'}
                                    </div>
                                </div>

                                {/* Scrollable chat messages */}
                                <div className="flex-1 overflow-y-auto px-[1rem] py-[1rem] gap-[0.625rem] flex flex-col">
                                    {(messages[currentChatroomId] || []).map((message) => {
                                        const isSender = message.sender_id == senderId;
                                        return (
                                            <div
                                                key={message.message_id}
                                                className={`flex ${
                                                    isSender ? 'justify-end pr-[0.5rem]' : 'justify-start pl-[0.5rem]'
                                                } items-center gap-[0.625rem]`}
                                            >
                                                <div
                                                    className={`rounded-full ${
                                                        isSender ? 'bg-blue-300' : 'bg-slate-300'
                                                    } px-[1rem] py-[0.5rem] max-w-[70%] break-words`}
                                                >
                                                    {message.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Message Input */}
                                <div className="flex items-center gap-[0.625rem] self-stretch p-[1rem]">
                                    <div className="flex justify-between items-center p-[0.625rem] flex-[1_0_0] rounded-lg bg-slate-200">
                                        <input
                                            className="text-sm font-medium leading-[1.25rem] w-full bg-transparent outline-none"
                                            placeholder="Type a message"
                                            value={messageContent}
                                            onChange={(e) => {
                                                setMessageContent(e.target.value);
                                            }}
                                        />
                                        <button onClick={handleSendMessage} className="ml-[0.5rem]">
                                            {/* send icon */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="1rem"
                                                height="1rem"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                            >
                                                <g clipPath="url(#clip0_4863_6095)">
                                                    <path
                                                        d="M14.6673 1.33301L10.0007 14.6663L7.33398 8.66634M14.6673 1.33301L1.33398 5.99967L7.33398 8.66634M14.6673 1.33301L7.33398 8.66634"
                                                        stroke="#9CA3AF"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_4863_6095">
                                                        <rect width="16" height="16" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
