// api for create new property

'use client';
import { Dispatch, SetStateAction, use, useState } from 'react';
// import { Property } from '../../../type/Property'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProperty, Property } from '@/store/propertySlice';
type EditPropertyProps = {
    setIsEditPropertyVisible: Dispatch<SetStateAction<boolean>>;
};

export default function EditProperty({ setIsEditPropertyVisible }: EditPropertyProps) {
    const dispatch = useAppDispatch();
    // const { properties, loading } = useAppSelector((state) => state.property);
    // const selectedProperty = properties.find((property) => property.id === PropertyID);

    // const [editProperty, setEditProperty] = useState<Property | null>(selectedProperty ?? null);
    const selectedProperty = useAppSelector((state) => state.property.selectedProperty);
    const [selectedFile, setSelectedFile] = useState<string | null>(selectedProperty?.image_url ?? null);
    const [name, setName] = useState<string | null>(selectedProperty?.name || '');
    const [location, setLocation] = useState<string | null>(selectedProperty?.location || '');
    const [size, setSize] = useState<number | null>(selectedProperty?.size || 0);
    const [price, setPrice] = useState<number | null>(selectedProperty?.price || null);

    const [errors, setErrors] = useState<{
        name?: boolean;
        location?: boolean;
        size?: boolean;
        price?: boolean;
    }>({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file.name);
        }
    };

    const handleSubmit = async () => {
        const newErrors: typeof errors = {};

        if (!name) newErrors.name = true;
        if (!location) newErrors.location = true;
        if (!size) newErrors.size = true;
        if (!price) newErrors.price = true;

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        const editProperty: Property = {
            name: name || '',
            location: location || '',
            size: size || 0,
            price: price ?? 0,
            id: selectedProperty?.id || 0,
            rating: selectedProperty?.rating || 0,
            date: selectedProperty?.date || new Date().toISOString(),
            image_url: selectedProperty?.image_url || '',
            reviews: selectedProperty?.reviews || 0,
            status: selectedProperty?.status || 'Available',
            detail: selectedProperty?.detail || '',
        };
        try {
            await dispatch(updateProperty(editProperty)).unwrap(); // Unwraps the promise to handle errors properly
            setIsEditPropertyVisible(false);
            console.log('Property updated successfully');
        } catch (error) {
            console.error('Error updating property:', error);
        }
    };

    return (
        <div className="flex z-50 w-[32.5rem] h-[calc(100vh-4rem)] p-0 flex-col items-start absolute right-0 bottom-0 border-l border-slate-300 bg-white shadow-[0px_4px_6px_-4px_rgba(0,_0,_0,_0.10),_0px_10px_15px_-3px_rgba(0,_0,_0,_0.10)]  overflow-y-auto">
            <div className="flex h-[2.5rem] p-[0.625rem] [0.75rem] items-center gap-[1.5rem] self-stretch sticky top-0 bg-white">
                <div className="flex items-center gap-[8px]">
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsEditPropertyVisible(false)}>
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M4 11.3334L7.33333 8.00008L4 4.66675M8.66667 11.3334L12 8.00008L8.66667 4.66675"
                                    stroke="#64748B"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button>
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M3.33301 7.33325V3.33325M3.33301 3.33325H7.33301M3.33301 3.33325L12.6663 12.6666M12.6663 8.66659V12.6666M12.6663 12.6666H8.66634"
                                    stroke="#64748B"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="w-[0.5px] h-[10px] bg-slate-400"></div>
                    <div className="text-slate-600 text-xs font-normal leading-[16px]" style={{ fontFamily: 'Inter' }}>
                        Edit Property
                    </div>
                </div>
            </div>

            <div className="flex h-[52.5rem] p-[1.25rem] [1.5rem] flex-col items-start gap-[0.625rem] self-stretch">
                <div className="flex flex-col items-start gap-[16px] self-stretch">
                    <div className="flex h-[280px] p-[28px] flex-col items-start gap-[10px] self-stretch rounded-[6px] bg-slate-200">
                        {/* <div className="flex-1 self-stretch bg-[url('https://loremflickr.com/400/200?random=2')] bg-lightgray bg-[50%] bg-cover bg-no-repeat"></div> */}
                    </div>
                    <div className="flex flex-col items-start gap-[4px] self-stretch">
                        <div className="flex items-start gap-[10px] self-stretch">
                            <div
                                className="text-slate-700 text-xs font-medium leading-[16px]"
                                style={{ fontFamily: 'Inter' }}
                            >
                                Image*
                            </div>
                        </div>
                        <div className="flex h-[40px] min-h-[40px] max-h-[40px] py-[8px] px-[12px] items-center self-stretch rounded-[6px] border border-slate-200 bg-white">
                            <div className="flex pr-[4px] flex-col items-center gap-[10px]">
                                <div className="flex py-[1px] px-[6px] items-center gap-[10px]">
                                    <label htmlFor="file-input" className="cursor-pointer">
                                        Choose file
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <div className="text-slate-700 text-sm font-normal" style={{ fontFamily: 'Inter' }}>
                                    {selectedFile ? selectedFile : 'No file chosen'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-[4px] self-stretch">
                        <div className="flex items-start gap-[10px] self-stretch">
                            <div
                                className="text-slate-700 text-xs font-medium leading-[16px]"
                                style={{ fontFamily: 'Inter' }}
                            >
                                Name*
                            </div>
                        </div>

                        <div
                            className={`flex p-[8px] w-full rounded-[6px] border ${
                                errors.name ? 'border-red-500' : 'border-slate-200'
                            }`}
                        >
                            <input
                                className="text-base font-normal leading-[24px] w-full outline-none"
                                style={{ fontFamily: 'Inter' }}
                                placeholder="Property Name"
                                value={name || ''}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex h-[144px] flex-col items-start gap-[4px] self-stretch">
                        <div className="flex items-start gap-[10px] self-stretch">
                            <div
                                className="text-slate-700 text-xs font-medium leading-[16px]"
                                style={{ fontFamily: 'Inter' }}
                            >
                                Location*
                            </div>
                        </div>
                        <div
                            className={`flex p-[8px] items-start gap-[10px] flex-1 self-stretch rounded-[6px] border ${
                                errors.location ? 'border-red-500' : 'border-slate-200'
                            }`}
                        >
                            <textarea
                                className="text-base font-normal leading-[24px] w-full h-full outline-none resize-none"
                                style={{ fontFamily: 'Inter' }}
                                placeholder="Property Location"
                                value={location || ''}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-[4px] self-stretch">
                        <div className="flex items-start gap-[10px] self-stretch">
                            <div
                                className="text-slate-700 text-xs font-medium leading-[16px]"
                                style={{ fontFamily: 'Inter' }}
                            >
                                Size* (Square meter)
                            </div>
                        </div>
                        <div className="flex items-center gap-[4px] self-stretch">
                            <div
                                className={`flex p-[8px] items-center gap-[10px] flex-1 rounded-[6px] border ${
                                    errors.size ? 'border-red-500' : 'border-slate-200'
                                }`}
                            >
                                <input
                                    type="number"
                                    className="text-base font-normal leading-[24px] w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    style={{ fontFamily: 'Inter' }}
                                    placeholder="eg. 100.00"
                                    value={size || 0}
                                    onChange={(e) => setSize(Number(e.target.value) || null)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-[4px] self-stretch">
                        <div className="flex items-start gap-[10px] self-stretch">
                            <div
                                className="text-slate-700 text-xs font-medium leading-[16px]"
                                style={{ fontFamily: 'Inter' }}
                            >
                                Price* (Baht per month)
                            </div>
                        </div>
                        <div
                            className={`flex p-[8px] items-center gap-[10px] self-stretch rounded-[6px] border ${
                                errors.price ? 'border-red-500' : 'border-slate-200'
                            }`}
                        >
                            <input
                                type="number"
                                className="w-full text-base font-normal leading-[24px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{ fontFamily: 'Inter' }}
                                placeholder="eg. 1,000.00"
                                value={price || ''}
                                onChange={(e) => setPrice(Number(e.target.value) || null)}
                            />
                        </div>
                        <div className="w-full h-[100px] empty"></div>
                    </div>
                </div>
            </div>
            <div className="flex p-[16px] justify-center items-center gap-3 self-stretch border-t border-slate-300 fixed bottom-0 right-0 w-[32.5rem] bg-white">
                <button
                    className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] border border-blue-900 hover:bg-[#EFF6FF]"
                    onClick={() => setIsEditPropertyVisible(false)}
                >
                    Cancel
                </button>
                <button
                    className="flex p-[12px] justify-center items-center gap-2 flex-1 rounded-[6px] bg-blue-900 text-white hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    Edit Property
                </button>
            </div>
        </div>
    );
}
