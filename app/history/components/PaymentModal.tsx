import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createPayment, updateReservationStatus } from '@/store/historySlice';
import { OmiseInstance } from '@/type/omise';
import { useRouter } from 'next/navigation';

type PaymentModalProps = {
    showModal: boolean;
    onClose: () => void;
    reservationId: number;
};

export default function PaymentModal({ showModal, onClose, reservationId }: PaymentModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [cardName, setCardName] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryMonth, setExpiryMonth] = useState<string>('');
    const [expiryYear, setExpiryYear] = useState<string>('');
    const [securityCode, setSecurityCode] = useState<string>('');
    const [omise, setOmise] = useState<OmiseInstance | null>(null);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.Omise) {
            const script = document.createElement('script');
            script.src = 'https://cdn.omise.co/omise.js';
            script.async = true;
            script.onload = () => {
                if (window.Omise) {
                    window.Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!);
                    setOmise(window.Omise);
                }
            };
            document.body.appendChild(script);
        } else if (window.Omise) {
            setOmise(window.Omise);
        }
    }, []);

    const isValidCard = (): boolean => {
        const newErrors: Record<string, boolean> = {};

        if (!cardName) newErrors.cardName = true;
        if (!/^[0-9]{16}$/.test(cardNumber)) newErrors.cardNumber = true;
        if (!/^\d{2}$/.test(expiryMonth) || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12)
            newErrors.expiryMonth = true;
        if (!/^\d{4}$/.test(expiryYear) || parseInt(expiryYear) < new Date().getFullYear()) newErrors.expiryYear = true;
        if (!/^\d{3,4}$/.test(securityCode)) newErrors.securityCode = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        isValidCard();
    }, [cardName, cardNumber, expiryMonth, expiryYear, securityCode]);

    const handleSubmit = async () => {
        if (!isValidCard()) return;

        if (omise) {
            const tokenParameters = {
                name: cardName,
                number: cardNumber,
                expiration_month: parseInt(expiryMonth),
                expiration_year: parseInt(expiryYear),
                security_code: parseInt(securityCode),
            };

            omise.createToken('card', tokenParameters, async (statusCode: number, response: any) => {
                if (statusCode === 200) {
                    console.log('Token created:', response.id);
                    try {
                        // Step 1: Dispatch payment
                        const paymentResult = await dispatch(
                            createPayment({
                                amount: 20,
                                reservationId: reservationId,
                                tokenData: response.id,
                            })
                        );

                        if (createPayment.fulfilled.match(paymentResult)) {
                            console.log('Payment Successful');

                            onClose(); // Close modal on success
                        }
                        router.replace(router.asPath, undefined, { scroll: false });
                    } catch (error) {
                        console.error('Payment or status update failed:', error);
                    }
                } else {
                    setErrors({
                        cardName: false,
                        cardNumber: false,
                        expiryMonth: false,
                        expiryYear: false,
                        securityCode: false,
                    });
                    console.error('Token creation failed:', response.message);
                }
            });
        } else {
            console.error('Omise is not loaded');
        }
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Pay Rental</h2>
                <div className="space-y-4">
                    {/* Card Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                        <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                            autoComplete="name"
                            className={`mt-1 w-full px-3 py-2 border ${
                                errors.cardName ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none`}
                        />
                        {errors.cardName && <p className="text-sm text-red-500">{errors.cardName}</p>}
                    </div>

                    {/* Card Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Card Number</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                            maxLength={16}
                            className={`mt-1 w-full px-3 py-2 border ${
                                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none`}
                        />
                        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                    </div>

                    {/* Expiry Date */}
                    <div className="flex space-x-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Month</label>
                            <input
                                type="text"
                                value={expiryMonth}
                                onChange={(e) => setExpiryMonth(e.target.value)}
                                required
                                maxLength={2}
                                placeholder="MM"
                                autoComplete="cc-exp-month"
                                className={`mt-1 w-full px-3 py-2 border ${
                                    errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:outline-none`}
                            />
                            {errors.expiryMonth && <p className="text-sm text-red-500">{errors.expiryMonth}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Year</label>
                            <input
                                type="text"
                                value={expiryYear}
                                onChange={(e) => setExpiryYear(e.target.value)}
                                required
                                placeholder="YYYY"
                                maxLength={4}
                                autoComplete="cc-exp-year"
                                className={`mt-1 w-full px-3 py-2 border ${
                                    errors.expiryYear ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm focus:outline-none`}
                            />
                            {errors.expiryYear && <p className="text-sm text-red-500">{errors.expiryYear}</p>}
                        </div>
                    </div>

                    {/* Security Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Security Code</label>
                        <input
                            type="password"
                            value={securityCode}
                            onChange={(e) => setSecurityCode(e.target.value)}
                            required
                            autoComplete="cc-csc"
                            maxLength={4}
                            className={`mt-1 w-full px-3 py-2 border ${
                                errors.securityCode ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none`}
                        />
                        {errors.securityCode && <p className="text-sm text-red-500">{errors.securityCode}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={Object.keys(errors).length > 0}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm ${
                                Object.keys(errors).length > 0 ? 'opacity-50 filter grayscale' : 'hover:bg-blue-700'
                            }`}
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
