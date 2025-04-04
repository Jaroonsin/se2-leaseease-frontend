'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { updateUserImage, updateUserInfo, uploadImage } from '@/src/store/slice/auth/userThunks'; // Assuming these actions exist
import { useRouter } from 'next/navigation';
import LoadPage from '@/src/components/ui/loadpage';
import { useAuth } from '@/src/hooks/useAuth';
import { ROUTES } from '@/src/types/routes';

export default function UserProfile() {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        address: '',
        picture: '', // Field for image_url
    });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { user, loading } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [errors, setErrors] = useState('');
    const [successMessage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadButton, setUploadButton] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setUserDetails({
                name: user.name || '',
                email: user.email || '',
                address: user.address || '',
                picture: user.image_url || '', // Load image_url if available
            });
            setImagePreview(user.image_url || ''); // Show current image as preview
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setUserDetails({ ...userDetails, picture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
        setUploadButton(true);
    };
    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const resultAction = await dispatch(uploadImage(formData));
            if (uploadImage.fulfilled.match(resultAction)) {
                await dispatch(updateUserImage());
            }
            router.push(ROUTES.USER.DASHBOARD);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(updateUserInfo(userDetails));
        if (updateUserInfo.fulfilled.match(resultAction)) {
            router.push(ROUTES.USER.DASHBOARD);
        } else {
            setErrors('Failed to update profile');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        // e.preventDefault();
        // if (newPassword !== confirmPassword) {
        //     setErrors('Passwords do not match');
        //     return;
        // }
        // const resultAction = await dispatch(updateUserPassword({ newPassword }));
        // if (updateUserPassword.fulfilled.match(resultAction)) {
        //     setSuccessMessage('Password reset successfully!');
        //     setErrors('');
        //     setNewPassword('');
        //     setConfirmPassword('');
        //     setTimeout(() => {
        //         setSuccessMessage('');
        //     }, 3000); // Clear success message after 3 seconds
        // } else {
        //     setErrors('Failed to reset password');
        // }
    };

    if (loading) return <LoadPage />;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-3xl p-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push(ROUTES.USER.DASHBOARD)}
                        className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Profile
                    </button>
                </div>

                <h2 className="text-2xl font-semibold text-gray-700 text-center">User Profile</h2>
                <p className="text-gray-500 text-center mb-6">Manage your personal details.</p>

                <form onSubmit={handleUpload} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                            <img
                                src={imagePreview || 'https://loremflickr.com/40/40?random=1'} // Default image if no picture is set
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="text-blue-600 cursor-pointer mt-2">
                            Change Picture
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                        {/* Submit Button */}
                        <div className="flex justify-center py-2">
                            <button
                                type="submit"
                                disabled={!uploadButton}
                                className={`text-xs px-2 py-1 ${
                                    uploadButton ? 'bg-green-500' : 'bg-gray-300'
                                } text-white rounded-3xl`}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </form>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={userDetails.name}
                            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                            className="w-full p-3 border rounded-3xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={userDetails.email}
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                            className="bg-gray-200 w-full p-3 border rounded-3xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                            disabled
                        />
                    </div>

                    {/* Address Field */}
                    <div>
                        <label htmlFor="address" className="block text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={userDetails.address}
                            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                            className="w-full p-3 border rounded-3xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    {/* Password Reset Section */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mt-6">Reset Password</h3>
                        <div>
                            <label htmlFor="newPassword" className="block text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 border rounded-3xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border rounded-3xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>

                        {/* Password Validation Error */}
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <div className="text-red-500 text-sm mt-2">Passwords do not match</div>
                        )}
                    </div>

                    {errors && (
                        <div className="mb-4 text-red-500 text-center text-xl font-semibold">
                            <p>{errors}</p>
                        </div>
                    )}

                    {/* Reset Password Button */}
                    {successMessage && (
                        <div className="mb-4 text-green-500 text-center text-xl font-semibold">
                            <p>{successMessage}</p>
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handlePasswordChange}
                            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                            className={`text-sm text-center ${
                                !newPassword || !confirmPassword || newPassword !== confirmPassword
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600`}
                        >
                            Reset Password
                        </button>
                    </div>

                    {/* Save Changes Button */}
                    {/* Check if there are any changes in the user details */}
                    {(() => {
                        const hasChanges =
                            user && (userDetails.name !== user.name || userDetails.address !== user.address);

                        return (
                            <button
                                type="submit"
                                disabled={!hasChanges}
                                className={`w-full ${
                                    hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                                } text-white p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-600 mt-4`}
                            >
                                {hasChanges ? 'Save Changes' : 'No Changes to Save'}
                            </button>
                        );
                    })()}
                </form>
            </div>
        </div>
    );
}
