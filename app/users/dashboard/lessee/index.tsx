'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/app/users/dashboard/components/Header';
import { useAuth } from '@/src/hooks/useAuth';
// import { CRangeSlider } from '@coreui/react-pro';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchAutocomplete, fetchSearchProperties } from '@/src/store/slice/autocompleteSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import LoadPage from '@/src/components/ui/loadpage';
import { ROUTES } from '@/src/types/routes';

export default function LesseeDashboard() {
    const { loading } = useAuth();
    const [search, setSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100000);
    const [minArea, setminArea] = useState<number>(0);
    const [maxArea, setmaxArea] = useState<number>(1000);
    const [rating, setRating] = useState<number>(0);
    const debounceTimeout1 = useRef<NodeJS.Timeout | null>(null);
    const debounceTimeout2 = useRef<NodeJS.Timeout | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [click, setClick] = useState(false);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const suggestions = useAppSelector((state) => state.autocompleteReducer?.suggestions || []);
    const searchProperties = useAppSelector((state) => state.autocompleteReducer.searchResults);
    const totalPages = useAppSelector((state) => state.autocompleteReducer.lastPage || 1);
    const loadingState = useAppSelector((state) => state.autocompleteReducer.loading);

    const handleClick = (path: string) => {
        setClick(true);
        router.push(path);
        setClick(false);
    };

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
            // if (search.trim()) {
            dispatch(
                fetchSearchProperties({
                    name: search,
                    minprice: minPrice,
                    maxprice: maxPrice,
                    minsize: minArea,
                    maxsize: maxArea,
                    sortby: 'price',
                    order: 'asc',
                    rating: rating,
                    page: currentPage,
                    pagesize: rowsPerPage,
                })
            );
            // }
        }, 1000);

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

    return loading || click ? (
        <LoadPage />
    ) : (
        <div className="flex w-full min-h-screen flex-col items-center rounded-[0.375rem] bg-gray-100">
            <Header />
            <div className="flex items-center gap-2.5 flex-1 self-stretch h-full bg-gray-100 ">
                <div className="flex flex-col py-10 items-center w-[23.61vw] h-100 gap-10 px-8 self-stretch bg-transparent w-[25rem] bg-white p-4 shadow-lg">
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

                    <div className="flex px-2 flex-col items-center gap-3 self-stretch w-80">
                        <h1 className="flex flex-col justify-center items-start gap-2.5 self-stretch font-bold">
                            Price Range
                        </h1>
                        <Slider
                            range
                            min={0}
                            max={100000}
                            value={[minPrice, maxPrice]}
                            onChange={handleSliderPriceChange}
                            step={1}
                        />
                        <div className="flex  justify-between self-stretch">
                            <div className="flex  flex-col w-36  items-start">
                                <p> Lowest Price </p>
                                <input
                                    type="number"
                                    className="flex w-4/5 h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex w-2.25 p-[20px_1px_0_1px] flex-col justify-center items-center gap-5 self-stretch">
                                <p className="self-stretch font-bold"> - </p>
                            </div>
                            <div className="flex flex-col  w-36 items-end">
                                <p> Highest Price </p>
                                <input
                                    type="number"
                                    className="flex w-4/5 h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex px-2 flex-col items-center gap-3 self-stretch ">
                        <h1 className="flex flex-col justify-center items-start gap-2.5 self-stretch font-bold">
                            Property Area Range
                        </h1>
                        <div></div>
                        <Slider
                            range
                            min={0}
                            max={1000}
                            value={[minArea, maxArea]}
                            onChange={handleSliderAreaChange}
                            step={1}
                        />
                        <div className="flex justify-between items-center self-stretch">
                            <div className="flex flex-col w-36 items-start">
                                <p> Minimum </p>
                                <input
                                    type="number"
                                    className="flex w-4/5 h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
                                    value={minArea}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex w-2.25 p-[20px_1px_0_1px] flex-col justify-center items-center gap-5 self-stretch">
                                <p className="self-stretch font-bold"> - </p>
                            </div>
                            <div className="flex flex-col w-36 items-end">
                                <p> Maximum </p>
                                <input
                                    type="number"
                                    className="flex w-4/5 h-7 p-2.5 px-5 justify-center items-center gap-2 rounded-lg bg-gray-200 text-center"
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
                                    type="radio"
                                    name="rating"
                                    className="w-5 h-5 accent-blue-500"
                                    onClick={() => setRating(item)}
                                />
                                <span className="text-sm text-yellow-400">{'★'.repeat(item)}</span>
                            </label>
                        ))}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                className="w-5 h-5 accent-blue-500"
                                onClick={() => setRating(0)}
                            />
                            <span className="text-sm text-gray-700">No Rating</span>
                        </label>
                    </div>
                </div>
                {loadingState ? (
                    <div className="flex flex-col items-center w-full h-[90vh] p-2 self-stretch bg-transparent overflow-y-auto scrollbar-hide">
                        <LoadPage></LoadPage>
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full h-[90vh] p-2 gap-3 self-stretch bg-transparent overflow-y-auto scrollbar-hide">
                        {/* right side */}
                        {searchProperties.length === 0 && (
                            <p className="flex justify-center items-center w-full h-full text-center">No Properties</p>
                        )}

                        {searchProperties.map((property) => (
                            <div
                                key={property.id}
                                className="flex p-5 items-center gap-2 rounded-xl border-2 border-slate-100 w-full cursor-pointer bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
                                onClick={() => handleClick(ROUTES.PROPERTIES(property.id))}
                            >
                                <div className="w-[382px] h-[160px] rounded-md">
                                    <img
                                        src={property.image_url}
                                        alt="Property image_url"
                                        className="w-full h-full rounded-md object-cover"
                                    />
                                </div>
                                <div className="flex w-[500px] p-2.5 flex-col justify-between items-start self-stretch">
                                    <div className="flex items-start gap-2 self-stretch justify-between align-center">
                                        <p className="text-2xl font-bold">{property.name}</p>
                                        <div className="flex items-center gap-1 text-yellow-800 font-semibold">
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
                                            <p>({property.review_count})</p>
                                        </div>
                                    </div>
                                    <p>Location: {property.location}</p>
                                    <div className="flex justify-between items-end self-stretch text-lg font-semibold text-blue-500">
                                        <p>Size: {property.size} m²</p>
                                        <p>
                                            <div className="text-2xl">
                                                {new Intl.NumberFormat('th-TH').format(property.price)}
                                            </div>{' '}
                                            <div>Baht/Month</div>{' '}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="w-full flex justify-end items-center gap-3 text-black px-4 py-3 bg-white border-t border-gray-200 fixed bottom-0 right-0">
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
                )}
            </div>
        </div>
    );
}
