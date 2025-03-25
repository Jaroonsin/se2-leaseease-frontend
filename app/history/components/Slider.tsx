import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';

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

export default function ReservationSlider({ reservation, onClose }: SliderProps) {
    const propertyInfo = reservation.propertyName;
    const userName = `Lessee ${reservation.lesseeID}`; // since no name provided in reservation
    const requestTime = new Date(reservation.lastModified).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
    });
    const purposeInfo = reservation.purpose;
    const imgPath = '/user.svg'; // default avatar

    return (
        <div
            className="flex z-50 w-[32.5rem] h-[calc(100vh-4rem)] flex-col fixed right-0 top-0 border-l border-gray-200 
                 bg-gradient-to-b from-white to-gray-50 shadow-2xl overflow-y-auto animate-fadeIn"
        >
            {/* Header */}
            <div className="flex h-12 px-4 items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center space-x-3">
                    <button onClick={onClose} className="transition transform hover:scale-105">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M4 11.3334L7.33333 8.00008L4 4.66675"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="transition transform hover:scale-105">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M3.33301 7.33325V3.33325H7.33301M3.33301 3.33325L12.6663 12.6666M12.6663 8.66659V12.6666H8.66634"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <div className="text-sm font-medium" style={{ fontFamily: 'Inter', lineHeight: '16px' }}>
                    Request Detail
                </div>
            </div>

            <div className="flex flex-col p-6 gap-4 relative">
                {/* User Profile Section */}
                <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <img src={imgPath} alt="User Avatar" className="w-20 h-20 rounded-full border" />
                    <div>
                        <h2 className="text-gray-500 text-lg font-semibold">{userName}</h2>
                        <p className="text-gray-500 text-sm">Requested at {requestTime}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 absolute top-6 right-6">
                    <button className="h-8 px-4 py-1 border border-gray-300 rounded-lg text-gray-600 text-sm bg-white hover:bg-gray-100 shadow-md flex items-center gap-2 transition transform hover:scale-105">
                        <VisibilityOutlinedIcon fontSize="small" />
                        View Profile
                    </button>
                    <button className="h-8 px-4 py-1 border border-blue-500 rounded-lg text-gray-600 text-sm bg-blue-100 hover:bg-blue-200 shadow-md flex items-center gap-2 transition transform hover:scale-105">
                        <NearMeOutlinedIcon fontSize="small" />
                        Send Message
                    </button>
                </div>

                {/* Details Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8 w-full">
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-gray-400 text-sm">Status</h3>
                            <p className="text-green-700 text-sm font-medium">{reservation.status}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-400 text-sm">Property</h3>
                            <p className="text-gray-600 text-sm">{propertyInfo}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-400 text-sm">Purpose</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{purposeInfo}</p>
                        </div>
                        {reservation.proposedMessage && (
                            <div>
                                <h3 className="text-gray-400 text-sm">Message</h3>
                                <p className="text-gray-600 text-sm">{reservation.proposedMessage}</p>
                            </div>
                        )}
                        {reservation.question && (
                            <div>
                                <h3 className="text-gray-400 text-sm">Question</h3>
                                <p className="text-gray-600 text-sm">{reservation.question}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
