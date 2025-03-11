'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import AcceptRequest from '../AcceptRequest';
import RejectRequest from '../RejectRequest';
import { requestData } from '@/src/api/data/request';

type RequestSliderProps = {
    id: string;
    totalRequests: number;
    currentRequest: number;
    setCurrentRequest: Dispatch<SetStateAction<number | null>>;
    tableData: requestData[];
};

export default function RequestSlider({
    id,
    totalRequests,
    currentRequest,
    setCurrentRequest,
    tableData,
}: RequestSliderProps) {
    const [status, setStatus] = useState<'Accept' | 'Reject' | 'None'>('None'); //example
    const data = tableData[currentRequest];
    // const [userName, setUserName] = useState('John Doe');
    // const [requestTime, setRequestTime] = useState('29 Oct 2024 22:45');
    // const [propertyInfo, setPropertyInfo] = useState('Lorem ipsum dolor sit amet');
    // const [purposeInfo, setPurposeInfo] = useState(
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper quam ac risus ornare...'
    // );
    const propertyInfo = data.propertyName;
    const userName = data.name;
    const requestTime = data.requestedAt;
    const purposeInfo = data.purpose;
    const imgPath = data.imageURL != '' ? data.imageURL : null;

    return (
        <div className="flex z-50 w-[32.5rem] h-[calc(100vh-4rem)] p-0 flex-col items-start absolute right-0 bottom-0 border-l border-slate-300 bg-white shadow-[0px_4px_6px_-4px_rgba(0,_0,_0,_0.10),_0px_10px_15px_-3px_rgba(0,_0,_0,_0.10)]  overflow-y-auto">
            <div className="flex h-[2.5rem] p-[0.625rem] [0.75rem] items-center gap-[1.5rem] self-stretch">
                {/* 1 */}
                <div className="flex items-center gap-[8px]">
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentRequest(null)}>
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M4 11.3334L7.33333 8.00008L4 4.66675M8.66667 11.3334L12 8.00008L8.66667 4.66675"
                                    stroke="#64748B"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button>
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M3.33301 7.33325V3.33325M3.33301 3.33325H7.33301M3.33301 3.33325L12.6663 12.6666M12.6663 8.66659V12.6666M12.6663 12.6666H8.66634"
                                    stroke="#64748B"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="w-[0.5px] h-[10px] bg-slate-400"></div>
                    <div
                        className="text-slate-600 text-xs font-normal"
                        style={{ fontFamily: 'Inter', lineHeight: '16px' }}
                    >
                        Request Detail
                    </div>
                </div>

                <div className="flex center gap-2 absolute right-2">
                    <p className="text-slate-600 text-sm font-normal">
                        {currentRequest + 1} of {totalRequests} Request
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`w-[16px] h-[16px] border border-s-slate-300 g-8 rounded-sm ${
                            currentRequest === 0 ? 'bg-slate-100' : 'bg-white'
                        }`}
                        onClick={() => setCurrentRequest(Math.max(0, currentRequest - 1))}
                    >
                        <path
                            d="M12 10L8 6L4 10"
                            stroke={`${currentRequest === 0 ? '#CBD5E1' : '#000000'}`}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`w-[16px] h-[16px] border border-s-slate-300 g-8 rounded-sm ${
                            currentRequest + 1 === totalRequests ? 'bg-slate-100' : 'bg-white'
                        }`}
                        onClick={() => setCurrentRequest(Math.min(totalRequests - 1, currentRequest + 1))}
                    >
                        <path
                            d="M4 6L8 10L12 6"
                            stroke={`${currentRequest + 1 === totalRequests ? '#CBD5E1' : '#000000'}`}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            <div className="flex h-[52.5rem] p-[1.25rem] [1.5rem] flex-col items-start gap-[0.625rem] self-stretch">
                {/* 2 */}

                {/* User Profile Section */}
                <div className="flex items-center gap-4">
                    <img
                        src={imgPath || '/user.svg'}
                        alt="User Avatar"
                        className="w-[80px] h-[80px] rounded-full border"
                    />
                    <div>
                        <h2 className="text-slate-600 text-sm font-normal">{userName}</h2>
                        <p className="text-slate-400 text-sm font-normal">Requested at {requestTime}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col justify-end gap-2 mt-4 absolute top-10 right-4">
                    <button className="h-[28px] px-4 py-1 border border-gray-300 rounded-lg text-slate-600 text-sm font-normal bg-white hover:bg-gray-100 shadow-md flex gap-x-2">
                        <VisibilityOutlinedIcon fontSize="small" />
                        View Profile
                    </button>
                    <button className="h-[28px] px-4 py-1 border border-blue-500 rounded-lg text-slate-600 text-sm font-normal bg-blue-100 hover:bg-blue-200 shadow-md flex gap-x-2">
                        <NearMeOutlinedIcon fontSize="small" />
                        Send Message
                    </button>
                </div>

                {/* Details Section */}
                <div className="">
                    <h3 className=" text-slate-400 text-sm font-normal">Property</h3>
                    <p className=" text-slate-600 text-sm font-normal">{propertyInfo}</p>
                    <h3 className=" text-slate-400 text-sm font-normal mt-3">Purpose</h3>
                    <p className=" text-slate-600 text-sm font-normal leading-relaxed">{purposeInfo}</p>
                </div>
            </div>

            <div className="flex p-[16px] justify-center items-center gap-3 self-stretch border-t border-slate-300 fixed bottom-0 right-0 w-[32.5rem] bg-white">
                <button
                    className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-green-50 border border-green-700 text-green-700 hover:bg-green-200"
                    onClick={() => setStatus('Accept')}
                >
                    Accept
                </button>
                <button
                    className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-red-50 border border-red-700 text-red-700 hover:bg-red-200"
                    onClick={() => setStatus('Reject')}
                >
                    Reject
                </button>
            </div>
            {status === 'Accept' && <AcceptRequest setIsAcceptRequestVisible={setStatus} />}
            {status === 'Reject' && <RejectRequest setIsRejectRequestVisible={setStatus} />}
        </div>
    );
}
