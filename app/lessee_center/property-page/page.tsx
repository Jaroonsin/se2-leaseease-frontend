'use client';

import React, { useState } from 'react';
import Header from '../../property/components/Header';

const PropertyPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [error, setError] = useState('');

    const handleRequestReservation = () => {
        if (!purpose.trim()) {
            setError('*fill in the blank*');
            return;
        }
        // Handle reservation logic here
        setShowModal(false);
        setPurpose('');
        setError('');
    };

    return (
        <div className="flex flex-col justify-center items-start">
            <Header />
            <div className="flex justify-center items-center self-stretch">
                <div className="flex flex-col items-center self-stretch w-3/4">
                    <div className="flex p-5 items-start w-[580px] h-[370px] bg-cover">
                        <img src="/bg-condo.jpg" alt="bg condo" />
                    </div>
                    <div className="flex py-2.5 px-10 items-start gap-10">
                        <div className="w-1/2 flex flex-col gap-2">
                            <h2 className="text-3xl font-medium">Core Udomsuk by Uni Living</h2>
                            <p>
                                254 Phaya Thai Rd, Khwaeng Wang Mai, Pathum Wan, Krung Thep Maha Nakhon 10330 254 Phaya
                                Thai Rd, Khwaeng Wang Mai, Pathum Wan, Krung Thep Maha Nakhon 10330 254 Phaya Thai Rd,
                                Khwaeng Wang Mai, Pathum Wan, Krung Thep Maha Nakhon 10330
                            </p>
                            <hr className="border-t border-gray-300"></hr>
                            <div className="flex justify-between items-center self-stretch">
                                <div>
                                    <p>Price</p>
                                    <p>B 10,000</p>
                                </div>
                                <div>
                                    <p>Size</p>
                                    <p>4,000 m^2</p>
                                </div>
                            </div>
                            <hr className="border-t border-gray-300"></hr>
                            <p className="text-xl font-medium">About Property</p>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industry's standard dummy text ever since the 1500s, when an unknown
                                printer took a galley of type and scrambled it to make a type specimen book. It has
                                survived not only five centuries, but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                                publishing software like Aldus PageMaker including versions of Lorem Ipsum
                            </p>
                        </div>
                        <div className="flex flex-col self-stretch w-1/2 gap-2.5">
                            <div className="flex w-[221px] flex-col items-start gap-[10px]">
                                <p className="text-xl font-medium">Rating</p>
                                <div className="flex gap-1">
                                    <p className="text-xl font-normal">4.5 / 5</p>
                                    <p className="text-xl font-normal">⭐</p>
                                    <p className="text-xl font-normal">(99)</p>
                                </div>
                            </div>
                            <div className="flex flex-col p-[12px] justify-center items-start gap-[10px] self-stretch border border-slate-100">
                                <div className="flex p-[10px] justify-center items-center gap-[20px]">
                                    <img src="/Avatar.png" alt="avatar" />
                                    <div className="flex flex-col items-start gap-1">
                                        <p>Lnwza 007</p>
                                        <p>MAHARACHA</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center gap-2 w-full">
                                    <button className=" border-blue-900 rounded-md border p-2 gap-2 flex justify-center items-center self-stretch w-full">
                                        <img src="/eye.svg" alt="eye icon" />
                                        <p className="text-blue-900 text-xs">View Profile</p>
                                    </button>
                                    <button className="border-blue-900 rounded-md border p-2 gap-2 flex justify-center items-center self-stretch w-full">
                                        <img src="/send.svg" alt="send icon" />
                                        <p className="text-blue-900 text-xs">Send message</p>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="bg-blue-900 rounded-md border p-2 gap-2 flex justify-center items-center self-stretch w-full"
                                    onClick={() => setShowModal(true)}
                                >
                                    <img src="/calendar-check.svg" alt="send icon" />
                                    <p className="text-white text-xs font-medium">Request Reservation</p>
                                </button>
                            </div>
                        </div>
                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg w-96">
                                    <h2 className="text-xl font-bold mb-4 text-center">Confirm Reservation</h2>
                                    <textarea
                                        className="w-full items-start border rounded-lg p-2 h-72 bg-slate-200 text-black placeholder-gray-400"
                                        placeholder="Type your purpose..."
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                    />
                                    <p className="text-sm font-light py-2.5 px-7 flex flex-column">
                                        You have to type your purpose or contract for reserve property.
                                    </p>
                                    {error && <p className="text-red-500 text-sm mb-4 px-7">{error}</p>}
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="bg-red-50 border-red-700 border text-red-700 px-4 py-2 rounded-lg w-1/2"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-green-50 border-green-700 border text-green-700 px-4 py-2 rounded-lg w-1/2"
                                            onClick={handleRequestReservation}
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyPage;
