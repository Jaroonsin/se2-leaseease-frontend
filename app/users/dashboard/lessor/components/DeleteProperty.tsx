'use client';
import { Dispatch, SetStateAction } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { deleteProperty, setSelectedProperty } from '@/src/store/slice/propertySlice';

type DeletePropertyProps = {
    setIsDeletePropertyVisible: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteProperty({ setIsDeletePropertyVisible }: DeletePropertyProps) {
    const dispatch = useAppDispatch();
    const handleDelete = async () => {
        try {
            await dispatch(deleteProperty()).unwrap(); // Unwraps the promise to handle errors properly
            setIsDeletePropertyVisible(false);
            dispatch(setSelectedProperty(null));
            console.log('Property deleting successfully');
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex w-[32rem] p-6 flex-col items-start gap-4 rounded-lg bg-white shadow-lg">
                <div className="flex w-[26.5rem] flex-col items-start">
                    <div className="flex items-center gap-[0.625rem] self-stretch">
                        <p className="text-[1.125rem] font-semibold text-[#1E293B]">Delete Property?</p>
                    </div>
                    <div className="flex items-center self-stretch gap-[0.625rem] pt-2">
                        <p className="text-[0.875rem] font-normal text-[#64748B]">
                            This action cannot be undone. This will permanently delete property.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end items-center self-stretch">
                    <button
                        className="flex h-10 min-h-10 max-h-10 px-4 py-2 flex-col justify-center items-center gap-[0.625rem] rounded-md border border-[#E4E4E7] bg-white"
                        onClick={() => setIsDeletePropertyVisible(false)}
                    >
                        Cancel
                    </button>
                    <div className="flex flex-col items-start gap-[0.625rem] pl-2">
                        <button
                            className="flex h-10 min-h-10 max-h-10 px-4 py-2 flex-col justify-center items-center gap-[0.625rem] rounded-md bg-[#B91C1C] text-white"
                            onClick={() => handleDelete()}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
