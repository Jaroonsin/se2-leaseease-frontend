'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeWebSocket, sendMessage, setSenderId } from '@/src/store/slice/chatSlice';
import { RootState, AppDispatch } from '@/src/store/store';
import Header from '@/app/users/dashboard/components/Header';
import { fetchUserInfo } from '@/src/store/slice/auth/userThunks';
import { useParams } from 'next/navigation';
import { fetchUserById } from '@/src/store/slice/userSlice';

interface Message {
    sender_id: number;
    receiver_id: number;
    content: string;
}

interface ApiResponse<T> {
    data: T;
}

export default function Chat() {
    const dispatch = useDispatch<AppDispatch>();
    const [messageContent, setMessageContent] = useState<string>('');
    const { user } = useSelector((state: RootState) => state.user);
    const { messages, senderId } = useSelector((state: RootState) => state.chat);
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

        const numericId = Number(id);
        if (isNaN(numericId)) return;

        dispatch(fetchUserById(numericId)).unwrap();
    }, [dispatch, id]);

    useEffect(() => {
        const fetchData = async () => {
            const action = await dispatch(fetchUserInfo());
            const userInfo = action.payload as ApiResponse<User>;

            if (userInfo?.data) {
                dispatch(setSenderId(Number(userInfo.data.id)));
                console.log('sender Id:', senderId);
            }
        };

        const initializeWebSocketConnection = async () => {
            await fetchData();
            dispatch(initializeWebSocket(Number(id)));
        };

        initializeWebSocketConnection();

        // console.log('this is message from socket:', messages)
    }, [dispatch]);

    const handleSendMessage = () => {
        if (messageContent.trim() === '') return; // Don't send empty messages
        if (senderId == null) return;
        console.log('sender Id', senderId);
        const newMessage: Message = {
            sender_id: senderId,
            receiver_id: Number(id), // hard-peace
            content: messageContent,
        };

        setMessageContent('');
        dispatch(sendMessage(newMessage));
    };

    return (
        <div className="flex w-full h-full flex-col items-center rounded-md bg-white">
            <Header />
            <div className="flex justify-center items-center flex-1 self-stretch">
                {/* <div className="flex flex-col h-[calc(100vh-4rem)] items-start gap-[0.5rem] self-stretch w-[23rem] p-[1rem] bg-slate-100 overflow-y-auto">
					<div className="flex items-center gap-[1.25rem] self-stretch h-[5rem] p-[0.625rem] rounded-[0.25rem] bg-slate-200">
						<div
							className="w-[3.75rem] h-[3.75rem] rounded-full bg-[url('https://loremflickr.com/40/40?random=1')] bg-lightgray bg-[size:199.261%_100%] bg-no-repeat">
						</div>
						<div className="flex flex-col items-start flex-[1_0_0]">
							<div className="flex items-center gap-[0.25rem] self-stretch">
								<div className="max-w-[16.5rem] text-[var(--Slate-900, #0F172A)] text-sm font-medium leading-[1.25rem]">
									UserLnwZa 1234
								</div>
							</div>
						</div>
					</div>
				</div> */}
                <div className="flex flex-1 h-[calc(100vh-4rem)] p-[1rem] flex-col items-start gap-[0.625rem] flex-1 self-stretch">
                    <div className="flex h-full flex-col items-start self-stretch rounded-[0.5rem] bg-slate-100">
                        <div className="flex h-[5rem] items-center gap-[0.625rem] self-stretch p-[1rem] gap-[0.625rem] border-b-[3px] border-b-white">
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

                        {/* chat here */}
                        <div className="flex flex-col justify-end items-center gap-[0.625rem] flex-[1_0_0] self-stretch mt-[1rem] overflow-y-auto">
                            {messages.map((message) => {
                                if (message.sender_id === senderId) {
                                    return (
                                        <div className="flex justify-end items-center gap-[0.625rem] self-stretch pr-[0.5rem]">
                                            <div className="rounded-full bg-blue-300 px-[1rem] py-[0.5rem]">
                                                {message.content}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="flex items-center gap-[0.625rem] self-stretch px-[0.5rem] py-0">
                                            <div className="rounded-full bg-slate-300 p-[1rem] py-[0.5rem]">
                                                {message.content}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>

                        <div className="flex items-center gap-[0.625rem] self-stretch p-[1rem] 1.25rem">
                            <div className="flex justify-between items-center p-[0.625rem] flex-[1_0_0] rounded-lg bg-slate-200">
                                <input
                                    className="text-sm font-medium leading-[1.25rem] w-full bg-transparent outline-none"
                                    placeholder="Type a message"
                                    value={messageContent}
                                    onChange={(e) => {
                                        setMessageContent(e.target.value);
                                    }}
                                ></input>
                                <button onClick={handleSendMessage} className="ml-[0.5rem]">
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
                </div>
            </div>
        </div>
    );
}
