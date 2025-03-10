'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../property/components/Header';
import { useAuth } from '@/hooks/useAuth';
// import { CRangeSlider } from '@coreui/react-pro';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAutocomplete, fetchSearchProperties } from '@/store/autocompleteSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import LoadPage from '@/components/ui/loadpage';

export default function PropertyPage({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();
    const [search, setSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(5000000);
    const [minArea, setminArea] = useState<number>(0);
    const [maxArea, setmaxArea] = useState<number>(5000);
    const [rating, setRating] = useState<number>(0);
    const debounceTimeout1 = useRef<NodeJS.Timeout | null>(null);
    const debounceTimeout2 = useRef<NodeJS.Timeout | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const totalPages = 10; //back given

    const dispatch = useAppDispatch();
    const suggestions = useAppSelector((state) => state.autocompleteReducer?.suggestions || []);
    const searchProperties = useAppSelector((state) => state.autocompleteReducer.searchResults);

    // Fetch autocomplete suggestions after 2 seconds of inactivity
    useEffect(() => {
        if (debounceTimeout1.current) {
            clearTimeout(debounceTimeout1.current);
        }

        debounceTimeout1.current = setTimeout(() => {
            if (search.trim()) {
                // console.log('fetching autocomplete');
                dispatch(fetchAutocomplete(search));
            }
        }, 1000);

        return () => {
            if (debounceTimeout1.current) clearTimeout(debounceTimeout1.current);
        };
    }, [search, dispatch]);

    useEffect(() => {
        if (debounceTimeout2.current) {
            clearTimeout(debounceTimeout2.current);
        }

        debounceTimeout2.current = setTimeout(() => {
            if (search.trim()) {
                dispatch(
                    fetchSearchProperties({
                        name: search,
                        minprice: minPrice,
                        maxprice: maxPrice,
                        minsize: minArea,
                        maxsize: maxArea,
                        sortby: 'price',
                        order: 'asc',
                        page: currentPage,
                        pagesize: rowsPerPage,
                    })
                );
            }
        }, 2000);

        return () => {
            if (debounceTimeout2.current) clearTimeout(debounceTimeout2.current);
        };
    }, [search, minPrice, maxPrice, minArea, maxArea, rating, currentPage, rowsPerPage, dispatch]);

    // useEffect(() => {
    //     console.log(1, searchProperties);
    // }, [searchProperties]);

    // useEffect(() => {
    //     console.log('selected:', search);
    // }, [search]);

    const handleSliderPriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setMinPrice(values[0]);
            setMaxPrice(values[1]);
        }
    };

    const handleSliderAreaChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setminArea(values[0]);
            setmaxArea(values[1]);
        }
    };

    return loading ? (
        <LoadPage />
    ) : (
        <div className="flex w-full min-h-screen flex-col items-center rounded-[0.375rem] bg-white">
            <Header />
            <div className="flex justify-center items-center gap-2.5 py-2 flex-1 self-stretch h-full">
                <div className="flex flex-col items-center w-[23.61vw] h-100 gap-10 px-2.5 self-stretch bg-transparent">
                    {/* left side */}

                    <div className="relative w-full">
                        {/* Search Box */}
                        <div className="flex h-[40px] min-h-[40px] max-h-[40px] w-full py-2 px-3 justify-between items-center flex-1 rounded-md bg-gray-200">
                            <input
                                className="text-base flex center bg-transparent w-full h-full outline-none"
                                placeholder="Search property"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setIsDropdownOpen(true); // Show dropdown when typing
                                }}
                                onFocus={() => setIsDropdownOpen(true)} // Show dropdown when focused
                                onBlur={() => {
                                    setTimeout(() => setIsDropdownOpen(false), 200); // Delay closing for selection click
                                }}
                            />
                        </div>

                        {/* Dropdown list */}
                        {isDropdownOpen && suggestions.length > 0 && (
                            <ul className="absolute w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto top-full z-10">
                                {[...new Set(suggestions)].map((option: string, index: number) => (
                                    <li
                                        key={`${option}-${index}`} // Ensuring a unique key
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => {
                                            setSearch(option);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex px-2 flex-col items-center gap-3 self-stretch">
                        <h1 className="flex px-3 flex-col justify-center items-start gap-2.5 self-stretch">
                            Price Range
                        </h1>
                        <Slider
                            range
                            min={0}
                            max={5000000}
                            value={[minPrice, maxPrice]}
                            onChange={handleSliderPriceChange}
                            step={1}
                        />
                        <div className="flex p-2.5 justify-between items-center self-stretch">
                            <div className="flex flex-col w-36 items-start">
                                <p> Lowest Price </p>
                                <input
                                    type="number"
                                    className="flex w-full h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex w-2.25 p-[20px_1px_0_1px] flex-col justify-center items-center gap-5 self-stretch">
                                <p className="self-stretch"> - </p>
                            </div>
                            <div className="flex flex-col w-36 items-start">
                                <p> Highest Price </p>
                                <input
                                    type="number"
                                    className="flex w-full h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex px-2 flex-col items-center gap-3 self-stretch">
                        <h1 className="flex px-3 flex-col justify-center items-start gap-2.5 self-stretch">
                            Property Area Range
                        </h1>
                        <Slider
                            range
                            min={0}
                            max={5000}
                            value={[minArea, maxArea]}
                            onChange={handleSliderAreaChange}
                            step={1}
                        />
                        <div className="flex p-2.5 justify-between items-center self-stretch">
                            <div className="flex flex-col w-36 items-start">
                                <p> Minimum </p>
                                <input
                                    type="number"
                                    className="flex w-full h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
                                    value={minArea}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex w-2.25 p-[20px_1px_0_1px] flex-col justify-center items-center gap-5 self-stretch">
                                <p className="self-stretch"> - </p>
                            </div>
                            <div className="flex flex-col w-36 items-start">
                                <p> Maximum </p>
                                <input
                                    type="number"
                                    className="flex w-full h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
                                    value={maxArea}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex px-2 flex-col items-start gap-1.5 self-stretch">
                        <p className="font-bold"> Rating </p>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-blue-500"
                                    onClick={() => setRating(item)}
                                />
                                <span className="text-sm text-yellow-400">{'★'.repeat(item)}</span>
                            </label>
                        ))}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 accent-blue-500" />
                            <span className="text-sm text-gray-700">No Rating</span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-col items-center w-[57.08vw] h-[84vh] gap-3 self-stretch bg-transparent overflow-y-auto scrollbar-hide">
                    {/* right side */}
                    {searchProperties.length === 0 && (
                        <p className="flex justify-center items-center w-full h-full text-center">No Properties</p>
                    )}

                    {searchProperties.map((property) => (
                        <div
                            key={property.id}
                            className="flex p-5 items-center gap-2 rounded-xl border-2 border-slate-100 w-full"
                        >
                            <div className="w-[382px] h-[160px] rounded-md">
                                <img
                                    src={property.image}
                                    alt="Property Image"
                                    className="w-full h-full rounded-md object-cover"
                                />
                            </div>
                            <div className="flex w-[450px] p-2.5 flex-col justify-between items-start self-stretch">
                                <div className="flex items-start gap-2 self-stretch justify-between align-center items-center">
                                    <p className="text-4xl">{property.name}</p>
                                    <div className="flex items-center gap-1">
                                        <p>{property.rating}</p>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="28"
                                            height="28"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                        >
                                            <path
                                                d="M13.9997 2.3335L17.6047 9.63683L25.6663 10.8152L19.833 16.4968L21.2097 24.5235L13.9997 20.7318L6.78967 24.5235L8.16634 16.4968L2.33301 10.8152L10.3947 9.63683L13.9997 2.3335Z"
                                                fill="#FACC15"
                                            />
                                        </svg>
                                        <p>({property.reviews})</p>
                                    </div>
                                </div>
                                <p>Location: {property.location}</p>
                                <div className="flex justify-between items-end self-stretch">
                                    <p>Size: {property.size}</p>
                                    <p className="text-2xl">{property.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="w-[66.4vw] flex justify-end items-center gap-3 text-black px-4 py-3 bg-white border-t border-gray-200 fixed bottom-0 right-0">
                        <span>Rows per page:</span>
                        <select
                            className="border border-gray-300 rounded-md px-2 py-1"
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>

                        <span>
                            {currentPage} of {totalPages}
                        </span>

                        {/* Previous Page Button */}
                        <button
                            className="border border-gray-300 rounded-md px-2 py-1 disabled:opacity-50"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Next Page Button */}
                        <button
                            className="border border-gray-300 rounded-md px-2 py-1 disabled:opacity-50"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
