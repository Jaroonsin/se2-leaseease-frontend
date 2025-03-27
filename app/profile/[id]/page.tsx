'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store/store';
import { updateUserImage, updateUserInfo, uploadImage } from '@/src/store/auth/userThunks';
import { useRouter, useParams } from 'next/navigation';
import LoadPage from '@/src/components/ui/loadpage';
import { fetchUserById } from '@/src/store/userSlice';

export default function UserProfile() {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        address: '',
        picture: '', // Field for image_url
    });
    // const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const dispatch = useAppDispatch();
    const router = useRouter();
    const { id } = useParams(); // Get user ID from route params
    const [errors, setErrors] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadButton, setUploadButton] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user);
    useEffect(() => {
        if (!id) return;

        const numericId = Number(id);
        if (isNaN(numericId)) return;

        dispatch(fetchUserById(numericId)).unwrap();
    }, [dispatch, id]);

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
            router.push('/property');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(updateUserInfo(userDetails));
        if (updateUserInfo.fulfilled.match(resultAction)) {
            router.push('/property');
        } else {
            setErrors('Failed to update profile');
        }
    };

    if (loading) return <LoadPage />;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-3xl p-8">
                <h2 className="text-2xl font-semibold text-gray-700 text-center">User Profile</h2>
                <p className="text-gray-500 text-center mb-6">Manage your personal details.</p>

                {errors && (
                    <div className="mb-4 text-red-500 text-center text-xl font-semibold">
                        <p>{errors}</p>
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                            <img
                                src={user?.image_url || 'https://loremflickr.com/40/40?random=1'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </form>

                <div className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={user?.name}
                            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                            className="w-full p-3 border rounded-3xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    {/* <div>
                        <label htmlFor="email" className="block text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={''}
                            className="bg-gray-200 w-full p-3 border rounded-3xl text-gray-700"
                            required
                            disabled
                        />
                    </div> */}

                    {/* Address Field */}
                    <div>
                        <label htmlFor="address" className="block text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={user?.address}
                            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                            className="w-full p-3 border rounded-3xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
