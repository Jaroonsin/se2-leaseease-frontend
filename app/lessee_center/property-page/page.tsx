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
        <div className="flex w-full min-h-screen flex-col items-center rounded-[0.375rem] bg-white">
            <Header />
            <div className="bg-white p-8 rounded-lg shadow-lg w-[960px]">
                <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/bg-condo.jpg')" }} />
                <div className="flex py-2.5 px-10 md:p-10 items-start gap-10">
                    <div className="w-1/2 flex flex-col gap-2">
                        <h2 className="text-3xl font-medium">Core Udomsuk by Uni Living</h2>
                        <p>
                            254 Phaya Thai Rd, Khwaeng Wang Mai, Pathum Wan, Krung Thep Maha Nakhon 10330 254 Phaya Thai
                            Rd, Khwaeng Wang Mai, Pathum Wan, Krung Thep Maha Nakhon 10330 254 Phaya Thai Rd, Khwaeng
                            Wang Mai, Pathum Wan, Krung Thep Maha Nakhon 10330
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
                        <div className="">
                            <p className="text-xl font-medium">About Property</p>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                        </div>
                    </div>
                    <div className="flex flex-col self-stretch w-1/2">
                        <div className="my-4">
                            <p className="text-lg font-bold">Rating</p>
                            <p>⭐ 4.5 / 5 (99)</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <button className=" text-blue-900 px-4 py-2 max-w-6xl border-blue-900 rounded-md border font-semibold">
                                View Profile
                            </button>
                            <button className="text-blue-900 px-4 py-2 border-blue-900 rounded-md border font-semibold">
                                Send Message
                            </button>
                            <button
                                className="bg-blue-900 text-white px-4 py-2 rounded-md items-stretch font-semibold"
                                onClick={() => setShowModal(true)}
                            >
                                Request Reservation
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
    );
};

export default PropertyPage;
