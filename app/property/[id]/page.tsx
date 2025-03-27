'use client';

import React, { useState, useEffect, use } from 'react';
import Header from '@/app/users/dashboard/lessee/components/Header';
import { useAuth } from '@/src/hooks/useAuth';
import LoadPage from '@/src/components/ui/loadpage';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchPropertyById, createLeaseReservation, fetchUserById } from '@/src/store/eachpropertySlice';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/types/routes';

function EachPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const [showModal, setShowModal] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [error, setError] = useState('');
    const { loading } = useAuth();
    const dispatch = useAppDispatch();
    const { selectedProperty, user } = useAppSelector((state) => state.eachproperty);
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const { id } = use(params);
    const router = useRouter();

    useEffect(() => {
        const fetchParams = async () => {
            if (id) {
                setPropertyId(Number(id));
            }
        };

        fetchParams();
    }, [params]);

    useEffect(() => {
        if (!propertyId) return;
        dispatch(fetchPropertyById(propertyId))
            .unwrap()
            .then(() => {
                dispatch(fetchUserById());
            })
            .catch((error) => {
                console.error('Failed to fetch property:', error);
            });
    }, [dispatch, propertyId]);

    const handleRequestReservation = async () => {
        if (!purpose.trim()) {
            setError('*fill in the blank*');
            return;
        }
        // Handle reservation logic here
        // setShowModal(false);
        // setPurpose('');
        // setError('');

        const reservationData = {
            interestedProperty: propertyId,
            proposedMessage: null,
            purpose: purpose,
            question: null,
        };

        try {
            await dispatch(createLeaseReservation(reservationData)).unwrap();
            setShowModal(false);
            setPurpose('');
            setError('');
            // Optionally, show a success message or redirect the user
        } catch (error) {
            setError('Failed to create reservation. Please try again.');
        }
    };

    console.log('Fetched User:', user);

    return loading ? (
        <LoadPage />
    ) : (
        <div className="flex flex-col justify-center items-start">
            <Header />
            <div className="flex justify-center items-center self-stretch">
                <div className="flex flex-col items-center self-stretch w-3/5">
                    <div className="flex p-5 items-start w-[580px] h-[370px] bg-cover">
                        <img
                            className="w-full h-full rounded-md object-cover"
                            src={
                                selectedProperty?.image_url && selectedProperty.image_url.trim() !== ''
                                    ? selectedProperty.image_url
                                    : '/bg-condo.jpg'
                            }
                        />
                    </div>
                    <div className="flex py-2.5 px-10 items-start gap-10 w-full">
                        <div className="w-1/2 flex flex-col gap-2">
                            <h2 className="text-3xl font-medium">{selectedProperty?.name}</h2>
                            <p>{selectedProperty?.location}</p>
                            <hr className="border-t border-gray-300"></hr>
                            <div className="flex justify-between items-center self-stretch">
                                <div>
                                    <p>Price</p>
                                    <div className="text-2xl">
                                        {new Intl.NumberFormat('th-TH').format(selectedProperty?.price || 0)}
                                    </div>{' '}
                                    <div>Baht/Month</div>
                                </div>
                                <div>
                                    <p>Size </p>
                                    <p>{selectedProperty?.size} m²</p>
                                </div>
                            </div>
                            <hr className="border-t border-gray-300"></hr>
                            <p className="text-xl font-medium">About Property</p>
                            <p>{selectedProperty?.details}</p>
                        </div>
                        <div className="flex flex-col self-stretch w-1/2 gap-2.5">
                            <div className="flex w-[221px] flex-col items-start gap-[10px]">
                                <p className="text-xl font-medium">Rating</p>
                                <div className="flex gap-1">
                                    <p className="text-xl font-normal">{selectedProperty?.rating} / 5</p>
                                    <p className="text-xl font-normal">⭐</p>
                                    <p className="text-xl font-normal">({selectedProperty?.review_count})</p>
                                </div>
                            </div>
                            <div className="flex flex-col p-[15px] justify-center items-start gap-[10px] self-stretch border border-slate-100">
                                <div className="flex p-3 justify-start items-center gap-4 w-full border-b border-gray-100 pb-3">
                                    <img
                                        className="w-14 h-14 rounded-full object-cover border border-gray-200"
                                        src={user?.image_url || '/default-avatar.png'}
                                        alt="user avatar"
                                    />
                                    <div className="flex flex-col items-start gap-0.5">
                                        <p className="font-semibold text-gray-800">{user?.name || 'User Name'}</p>
                                        <p className="text-sm text-gray-600">
                                            {user?.address || 'No address provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center gap-2 w-full">
                                    <button
                                        className=" border-blue-900 rounded-md border p-2 gap-2 flex justify-center items-center self-stretch w-full"
                                        onClick={() => router.push(ROUTES.PROFILE(user?.id!))}
                                    >
                                        <img src="/eye.svg" alt="eye icon" />
                                        <p className="text-blue-900 text-xs">View Profile</p>
                                    </button>
                                    <button
                                        className="border-blue-900 rounded-md border p-2 gap-2 flex justify-center items-center self-stretch w-full"
                                        onClick={() => router.push(ROUTES.MESSAGES(user?.id!))}
                                    >
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
                                        className="resize-none w-full h-5 items-start border rounded-lg p-2 h-72 bg-slate-200 text-black placeholder-gray-400"
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
}

export default EachPropertyPage;
