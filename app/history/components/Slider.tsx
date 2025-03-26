import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { createReview, deleteReservation } from '@/store/historySlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PaymentModal from './PaymentModal';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

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

type SliderProps = {
    reservation: Reservation;
    onClose: () => void;
};
const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function ReservationSlider({ reservation, onClose }: SliderProps) {
    const propertyInfo = reservation.propertyName;
    const dispatch = useDispatch<AppDispatch>();
    const userName = `Lessee ${reservation.lesseeID}`; // since no name provided in reservation
    const requestTime = new Date(reservation.lastModified).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
    });
    const [showModalCancle, setShowModalCancle] = useState<boolean>(false);
    const [showModalReview, setShowModalReview] = useState<boolean>(false);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const purposeInfo = reservation.purpose;
    const [review, setReview] = useState('');
    const [error, setError] = useState('');
    const [rating, setRating] = useState<number | null>(0); // New rating state
    const imgPath = '/user.svg'; // default avatar
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
    const router = useRouter();
    const handleDelete = () => {
        dispatch(deleteReservation(reservation.id));
        setShowModalCancle(false);
    };

    const handleReview = async () => {
        try {
            const resultAction = await dispatch(
                createReview({
                    property_id: reservation.interestedProperty,
                    rating,
                    review_message: review,
                })
            );

            if (createReview.fulfilled.match(resultAction)) {
                console.log('good');
                console.log('Review created successfully:', resultAction.payload);
            } else {
                console.error('Review creation failed:', resultAction.payload);
            }
        } catch (error) {
            console.error('Error creating review:', error);
        }
        // console.log(reservation.interestedProperty);
        // console.log('Review text:', review);
        // console.log('Rating:', rating);
        setError('');
        setShowModalReview(false);
    };

    const renderFooterButtons = () => {
        switch (reservation.status) {
            case 'active':
                return (
                    <div className="flex p-[16px] justify-center items-center gap-3 self-stretch border-t border-slate-300 fixed bottom-0 right-0 w-[32.5rem] bg-white">
                        <button
                            className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-green-50 border border-green-700 text-green-700 hover:bg-green-200"
                            onClick={() => {
                                setShowModalReview(true);
                            }}
                        >
                            Review
                        </button>
                    </div>
                );
            case 'cancel':
                return null; // no footer buttons rendered for canceled status
            case 'pending':
                return (
                    <div className="flex p-[16px] justify-center items-center gap-3 self-stretch border-t border-slate-300 fixed bottom-0 right-0 w-[32.5rem] bg-white">
                        <button
                            className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-red-50 border border-red-700 text-red-700 hover:bg-red-200"
                            onClick={() => {
                                setShowModalCancle(true);
                            }}
                        >
                            Cancel Request
                        </button>
                    </div>
                );
            case 'payment':
                return (
                    <div className="flex p-[16px] justify-center items-center gap-3 self-stretch border-t border-slate-300 fixed bottom-0 right-0 w-[32.5rem] bg-white">
                        <button
                            className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-red-50 border border-red-700 text-red-700 hover:bg-red-200"
                            onClick={() => {
                                setShowModalCancle(true);
                            }}
                        >
                            Cancel Request
                        </button>
                        <button
                            className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-green-50 border border-green-700 text-green-700 hover:bg-green-200"
                            onClick={() => {
                                setShowPaymentModal(true);
                            }}
                        >
                            Pay Rental
                        </button>
                    </div>
                );
            case 'expired':
                return (
                    <div className="flex p-[16px] justify-center items-center gap-3 self-stretch border-t border-slate-300 fixed bottom-0 right-0 w-[32.5rem] bg-white">
                        <button
                            className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-green-50 border border-green-700 text-green-700 hover:bg-green-200"
                            onClick={() => {
                                setShowModalReview(true);
                            }}
                        >
                            Review
                        </button>
                        <button
                            className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-yellow-50 border border-yellow-700 text-yellow-700 hover:bg-yellow-200"
                            onClick={async () => {
                                // handle renew logic here
                            }}
                        >
                            Renew
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex z-50 w-[32.5rem] h-[calc(100vh-4rem)] p-0 flex-col items-start absolute right-0 bottom-0 border-l border-slate-300 bg-white shadow-[0px_4px_6px_-4px_rgba(0,_0,_0,_0.10),_0px_10px_15px_-3px_rgba(0,_0,_0,_0.10)]  overflow-y-auto">
            <div className="flex h-[2.5rem] p-[0.625rem] [0.75rem] items-center gap-[1.5rem] self-stretch">
                {/* 1 */}
                <div className="flex items-center gap-[8px]">
                    <div className="flex items-center gap-1">
                        <button onClick={onClose}>
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M4 11.3334L7.33333 8.00008L4 4.66675M8.66667 11.3334L12 8.00008L8.66667 4.66675"
                                    stroke="#64748B"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="w-[0.5px] h-[10px] bg-slate-400"></div>
                    <div className="text-slate-600 text-xs font-normal" style={{ lineHeight: '16px' }}>
                        Request Detail
                    </div>
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
                        <h2 className="text-slate-400 text-sm font-normal">{userName}</h2>
                        <p className="text-slate-400 text-sm font-normal">Requested at {requestTime}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col justify-end gap-2 mt-4 absolute top-10 right-4">
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
                    <button
                        className="flex py-[0.375rem] px-[0.5rem] flex-col justify-center items-center gap-[0.625rem] rounded-md border border-[#1E3A8A] hover:border-blue-900 hover:bg-blue-50"
                        onClick={() => router.push(`/lessee_center/${reservation.interestedProperty}`)}
                    >
                        <div className="flex justify-center items-center gap-[0.625rem]">
                            <p className="text-[#1E3A8A] text-xs font-medium leading-[1rem]">View Property</p>
                        </div>
                    </button>
                </div>

                {/* Details Section */}
                <div className="">
                    <h3 className=" text-slate-400 text-sm font-normal mt-3">Property</h3>
                    <p className=" text-slate-600 text-sm font-normal">{propertyInfo}</p>
                    <h3 className=" text-slate-400 text-sm font-normal mt-3">Purpose</h3>
                    <p className=" text-slate-600 text-sm font-normal leading-relaxed">{purposeInfo}</p>
                </div>
            </div>
            {renderFooterButtons()}
            {showModalCancle && (
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
                                onClick={() => setShowModalCancle(false)}
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
            {showModalReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-center">Review</h2>
                        <textarea
                            className="resize-none w-full h-5 items-start border rounded-lg p-2 h-72 bg-slate-200 text-black placeholder-gray-400"
                            placeholder="Type your review..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                        <div className="flex flex-column justify-center">
                            <Stack spacing={1} className="mb-4">
                                <Rating
                                    name="review-rating"
                                    value={rating}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        console.log(newValue);
                                        setRating(newValue);
                                        if (newValue && newValue > 0) {
                                            setError('');
                                        }
                                    }}
                                    // If error exists, style the empty icons with red color.
                                    sx={error ? { '& .MuiRating-iconEmpty': { color: 'red' } } : {}}
                                />
                            </Stack>
                        </div>
                        {error && (
                            <p className="text-sm font-light py-2.5 px-7 flex flex-col text-center justify-center text-red-500">
                                {error}
                            </p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-red-50 border-red-700 border text-red-700 px-4 py-2 rounded-lg w-1/2"
                                onClick={() => setShowModalReview(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-50 border-green-700 border text-green-700 px-4 py-2 rounded-lg w-1/2"
                                onClick={handleReview}
                            >
                                Send Review
                            </button>
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
    );
}
