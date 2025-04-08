'use client';
import { useEffect, useState } from 'react';
import Header from '@/app/users/dashboard/components/Header';
import SingleHistory from './components/SingleHistory';
// import { fetchUserInfo } from '@/store/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store/store';
import { fetchReservations } from '@/src/store/slice/historySlice';
import ReservationSlider from './components/Slider';
import { useAuth } from '@/src/hooks/useAuth';
import LoadPage from '@/src/components/ui/loadpage';

type Reservation = {
    id: number;
    purpose: string;
    proposedMessage: string;
    question: string;
    status: string;
    interestedProperty: number;
    lesseeID: number;
    propertyName: string;
    lastModified: string;
};

export default function Page() {
    const dispatch = useDispatch<AppDispatch>();
    const { reservations } = useSelector((state: RootState) => state.reservations);
    // const [reservations, setReservations] = useState(mockReservations);
    const [status, setStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'propertyName' | 'lastModified'>('propertyName');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const { loading } = useAuth();

    useEffect(() => {
        // const fetchData = async () => {
        // 	const action = await dispatch(fetchUserInfo())
        // 	console.log('fetchUserInfo result:', action)
        // }
        const fetchHistory = async () => {
            const action = await dispatch(fetchReservations());
            if (action.payload && typeof action.payload !== 'string') {
                // Success case - action.payload will be ApiResponse<Reservation[]>
                // setReservations(action.payload.data || [])
                console.log('Reservations data:', action.payload.data);
            } else {
                // Error case - action.payload will be a string
                console.error('Error fetching reservations:', action.payload);
            }
        };
        // fetchData()
        fetchHistory();
    }, [dispatch]);

    if (loading) return <LoadPage></LoadPage>;
    // if (error) return <div>Error: {error}</div>

    const updatedReservations = reservations.map((reservation) => {
        const updated = { ...reservation };

        // First, map certain statuses as before.
        if (updated.status === 'waiting') {
            updated.status = 'payment';
        } else if (updated.status === 'accept') {
            updated.status = 'active';
        }

        // Now, if the status is active, apply the new logic based on lastModified date.
        if (updated.status === 'active') {
            // Calculate the difference in days between now and lastModified.
            const diffDays = (Date.now() - new Date(updated.lastModified).getTime()) / (1000 * 60 * 60 * 24);

            // Check if diffDays is between 30 and 32 days.
            if (diffDays >= 30 && diffDays < 32) {
                updated.status = 'expired';
            } else if (diffDays >= 32) {
                updated.status = 'cancel';
            }
        }

        return updated;
    });

    // Then, filter the reservations based on the selected status (or 'all').
    const filteredReservations = updatedReservations.filter(
        (reservation) => status === 'all' || reservation.status === status
    );

    // And sort the reservations as needed.
    const sortedReservations = filteredReservations.sort((a, b) => {
        if (sortBy === 'propertyName') {
            return a.propertyName.localeCompare(b.propertyName);
        } else {
            return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        }
    });

    return (
        <div className=" flex w-full flex-col items-center rounded-md">
            <Header />
            <div className="flex h-[53rem] p-[0.625rem] flex-col items-start gap-[0.625rem] flex-shrink-0">
                <div className="flex h-[2.25rem] p-[0.25rem] justify-center items-center flex-shrink-0 rounded-lg bg-zinc-100">
                    <div
                        className={`flex w-[5rem] h-[1.75rem] py-[0.25rem] px-[0.75rem] flex-col justify-center items-center gap-[0.625rem] rounded-md ${
                            status === 'all' ? 'bg-white shadow-md' : 'hover:bg-slate-200 hover:shadow-md'
                        }`}
                    >
                        <button
                            className="flex justify-center items-center gap-[0.625rem]"
                            onClick={() => setStatus('all')}
                        >
                            <p
                                className={`text-sm font-medium leading-[1.25rem] ${
                                    status === 'all' ? 'text-slate-900' : 'text-slate-500'
                                }`}
                            >
                                All
                            </p>
                        </button>
                    </div>

                    <div
                        className={`flex w-[5rem] h-[1.75rem] py-[0.25rem] px-[0.75rem] flex-col justify-center items-center gap-[0.625rem] rounded-md ${
                            status === 'active' ? 'bg-white shadow-md' : 'hover:bg-slate-200 hover:shadow-md'
                        }`}
                    >
                        <button
                            className="flex justify-center items-center gap-[0.625rem]"
                            onClick={() => setStatus('active')}
                        >
                            <p
                                className={`text-sm font-medium leading-[1.25rem] ${
                                    status === 'active' ? 'text-slate-900' : 'text-slate-500'
                                }`}
                            >
                                Active
                            </p>
                        </button>
                    </div>

                    <div
                        className={`flex w-[5rem] h-[1.75rem] py-[0.25rem] px-[0.75rem] flex-col justify-center items-center gap-[0.625rem] rounded-md ${
                            status === 'pending' ? 'bg-white shadow-md' : 'hover:bg-slate-200 hover:shadow-md'
                        }`}
                    >
                        <button
                            className="flex justify-center items-center gap-[0.625rem]"
                            onClick={() => setStatus('pending')}
                        >
                            <p
                                className={`text-sm font-medium leading-[1.25rem] ${
                                    status === 'pending' ? 'text-slate-900' : 'text-slate-500'
                                }`}
                            >
                                Pending
                            </p>
                        </button>
                    </div>

                    <div
                        className={`flex w-[5rem] h-[1.75rem] py-[0.25rem] px-[0.75rem] flex-col justify-center items-center gap-[0.625rem] rounded-md ${
                            status === 'payment' ? 'bg-white shadow-md' : 'hover:bg-slate-200 hover:shadow-md'
                        }`}
                    >
                        <button
                            className="flex justify-center items-center gap-[0.625rem]"
                            onClick={() => setStatus('payment')}
                        >
                            <p
                                className={`text-sm font-medium leading-[1.25rem] ${
                                    status === 'payment' ? 'text-slate-900' : 'text-slate-500'
                                }`}
                            >
                                Waiting
                            </p>
                        </button>
                    </div>

                    <div
                        className={`flex w-[5rem] h-[1.75rem] py-[0.25rem] px-[0.75rem] flex-col justify-center items-center gap-[0.625rem] rounded-md ${
                            status === 'expired' ? 'bg-white shadow-md' : 'hover:bg-slate-200 hover:shadow-md'
                        }`}
                    >
                        <button
                            className="flex justify-center items-center gap-[0.625rem]"
                            onClick={() => setStatus('expired')}
                        >
                            <p
                                className={`text-sm font-medium leading-[1.25rem] ${
                                    status === 'expired' ? 'text-slate-900' : 'text-slate-500'
                                }`}
                            >
                                Expired
                            </p>
                        </button>
                    </div>

                    <div
                        className={`flex w-[5rem] h-[1.75rem] py-[0.25rem] px-[0.75rem] flex-col justify-center items-center gap-[0.625rem] rounded-md ${
                            status === 'cancel' ? 'bg-white shadow-md' : 'hover:bg-slate-200 hover:shadow-md'
                        }`}
                    >
                        <button
                            className="flex justify-center items-center gap-[0.625rem]"
                            onClick={() => setStatus('cancel')}
                        >
                            <p
                                className={`text-sm font-medium leading-[1.25rem] ${
                                    status === 'cancel' ? 'text-slate-900' : 'text-slate-500'
                                }`}
                            >
                                Cancel
                            </p>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-start flex-[1_0_0] rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex flex-col items-start self-stretch bg-white rounded-lg">
                        <div className="flex px-[0.5rem] items-start self-stretch">
                            <div className="flex w-[30.4375rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem]">
                                <div className="flex items-center rounded-md">
                                    <div className="flex justify-center items-center gap-[0.625rem]">
                                        <p className="text-slate-400 text-sm font-medium leading-[1.25rem]">Property</p>
                                    </div>
                                    <button
                                        className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]"
                                        onClick={() => setSortBy('propertyName')}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1rem"
                                            height="1rem"
                                            viewBox="0 0 17 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M14.5 10.6665L11.8333 13.3332M11.8333 13.3332L9.16667 10.6665M11.8333 13.3332V2.6665M2.5 5.33317L5.16667 2.6665M5.16667 2.6665L7.83333 5.33317M5.16667 2.6665V13.3332"
                                                stroke="#94A3B8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-[12.5rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem]">
                                <div className="flex w-[12.5rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem]"></div>
                            </div>
                            <div className="flex w-[16rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem]">
                                <div className="flex items-center rounded-md">
                                    <div className="flex justify-center items-center gap-[0.625rem]">
                                        <p className="text-slate-400 text-sm font-medium leading-[1.25rem]">
                                            Last Response
                                        </p>
                                    </div>
                                    <button
                                        className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]"
                                        onClick={() => setSortBy('lastModified')}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1rem"
                                            height="1rem"
                                            viewBox="0 0 17 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M14.5 10.6665L11.8333 13.3332M11.8333 13.3332L9.16667 10.6665M11.8333 13.3332V2.6665M2.5 5.33317L5.16667 2.6665M5.16667 2.6665L7.83333 5.33317M5.16667 2.6665V13.3332"
                                                stroke="#94A3B8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-[7rem] py-[0.75rem] px-[1rem] flex-col justify-center items-center gap-[0.625rem]">
                                <div className="flex justify-center items-center gap-[0.625rem]">
                                    <p className="text-slate-400 text-sm font-medium leading-[1.25rem] text-center">
                                        Status
                                    </p>
                                </div>
                                <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]">
                                    <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]"></div>
                                </div>
                            </div>
                            <div className="flex py-[0.75rem] px-[1rem] flex-col justify-center items-center gap-[0.625rem] flex-[1_0_0]">
                                <div className="flex justify-center items-center gap-[0.625rem]">
                                    <p className="text-slate-400 text-sm font-medium leading-[1.25rem]">
                                        View Property
                                    </p>
                                </div>
                                <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]">
                                    <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-[0.625rem] self-stretch">
                            <div className="w-full h-[0.0625rem] bg-slate-200"></div>
                        </div>
                    </div>

                    {/*  */}
                    {sortedReservations.length === 0 ? (
                        <div className="flex w-full h-full justify-center items-center text-center align-center">
                            <p>No properties found for the selected status.</p>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-50">
                            {sortedReservations.map((reservation) => (
                                <SingleHistory
                                    key={reservation.id}
                                    reservation={reservation}
                                    onShowSlider={() => setSelectedReservation(reservation)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {selectedReservation && (
                <ReservationSlider reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
            )}
        </div>
    );
}
