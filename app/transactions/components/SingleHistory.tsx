import { useState } from 'react';
import { deleteReservation } from '@/src/store/historySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import PaymentModal from './PaymentModal';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/types/routes';

type ReservationProps = {
    reservation: {
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
    onShowSlider: (show: boolean) => void;
};

export default function SingleHistory({ reservation, onShowSlider }: ReservationProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const router = useRouter();
    const { successMessage, error, loading } = useSelector((state: RootState) => state.reservations);

    const handleDelete = () => {
        dispatch(deleteReservation(reservation.id));
        setShowModal(false);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC',
        };

        const formattedDate = date.toLocaleString('en-GB', options);

        return formattedDate.replace(',', '');
    };

    const capitalizeFirstLetter = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Utility function to determine the status color
    const getStatusClasses = (status: string) => {
        switch (status.toLowerCase()) {
            case 'cancel':
                return 'bg-gray-100 text-gray-500';
            case 'payment':
                return 'bg-red-100 text-red-500';
            case 'active':
                return 'bg-green-100 text-green-500';
            case 'pending':
                return 'bg-yellow-100 text-yellow-500';
            case 'waiting':
                return 'bg-purple-100 text-purple-500';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="flex w-full flex-col items-start bg-white ">
            <div
                className="flex w-full flex-col items-start bg-white cursor-pointer"
                onClick={() => {
                    onShowSlider(true);
                }}
            >
                <div className="flex w-full h-[3.5rem] px-[0.5rem] items-start">
                    <div className="flex w-[42rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
                        <div className="flex items-center gap-[0.625rem] self-stretch">
                            <p className="text-slate-600 text-sm font-medium leading-[1.25rem]">
                                {reservation.propertyName}
                                {/* {reservation.id} */}
                            </p>
                            {/* {(reservation.status === 'pending' || reservation.status === 'payment') && (
                                <button
                                    onClick={(e) => {
                                        onShowSlider(false);
                                        e.stopPropagation();
                                        setShowModal(true);
                                    }}
                                >
                                    <p className="text-slate-400 text-xs font-thin leading-[1rem] underline">cancel</p>
                                </button>
                            )} */}
                        </div>
                    </div>
                    <div className="flex w-[17rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
                        <div className="flex w-[16rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
                            <p className="text-slate-600 text-sm font-medium leading-[1.25rem]">
                                {formatDate(reservation.lastModified)}
                            </p>
                        </div>
                    </div>
                    <div className="flex w-[7rem] py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
                        <div className="flex justify-between items-center self-stretch">
                            <div
                                className={`flex py-[0.375rem] px-[0.5rem] flex-col justify-center items-center gap-[0.625rem] flex-[1_0_0] rounded-full cursor-default ${getStatusClasses(
                                    reservation.status
                                )}`}
                            >
                                <div className="flex justify-center items-center gap-[0.625rem]">
                                    <p className="text-xs font-medium leading-[1rem]">
                                        {capitalizeFirstLetter(reservation.status)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex py-[0.75rem] px-[1rem] flex-col justify-center items-start gap-[0.625rem] self-stretch">
                        <div className="flex justify-between items-center self-stretch">
                            <button
                                className="flex py-[0.375rem] px-[0.5rem] flex-col justify-center items-center gap-[0.625rem] rounded-md border border-[#1E3A8A] hover:border-blue-900 hover:bg-blue-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(ROUTES.PROPERTIES(reservation.interestedProperty));
                                }}
                            >
                                <div className="flex justify-center items-center gap-[0.625rem]">
                                    <p className="text-[#1E3A8A] text-xs font-medium leading-[1rem]">View Property</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-[0.625rem] self-stretch">
                    <div className="w-full h-[0.0625rem] bg-slate-200"></div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="flex w-[40rem] p-6 flex-col items-center justify-center gap-4 rounded-lg bg-white">
                            <div className="flex w-[32rem] flex-col items-center justify-center text-center gap-4">
                                {/* Added gap-4 to add space between text */}
                                <p className="text-[1.125rem] font-semibold text-[#1E293B]">
                                    Are you sure you want to cancel this reservation?
                                </p>
                                <p className="text-[1.125rem] font-semibold text-[#1E293B]">
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center items-center self-stretch mt-4 gap-4">
                                <button
                                    className="flex h-10 min-h-10 max-h-10 px-4 py-2 flex-col justify-center items-center gap-[0.625rem] rounded-md border border-[#E4E4E7] bg-white hover:bg-gray-100"
                                    onClick={() => setShowModal(false)}
                                >
                                    No, keep reservation
                                </button>
                                <div className="flex flex-col items-start gap-[0.625rem] pl-2 ml-2">
                                    <button
                                        className="flex h-10 min-h-10 max-h-10 px-4 py-2 flex-col justify-center items-center gap-[0.625rem] rounded-md border border-orange-700 bg-red-700 text-white hover:bg-white hover:text-red-500 hover:bg-red-100"
                                        onClick={handleDelete}
                                    >
                                        Yes, cancel reservation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <PaymentModal
                    showModal={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    reservationId={reservation.id}
                />
            </div>
        </div>
    );
}
