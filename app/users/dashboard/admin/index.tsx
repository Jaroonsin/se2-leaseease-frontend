'use client';
import { getReviewData, reviewData } from '@/src/api/data/review';
import { useEffect, useState } from 'react';
import Header from '@/app/users/dashboard/components/Header';
// import { fetchUserInfo } from '@/store/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store/store';
import Slider from './slider';
import { fetchReservations } from '@/src/store/slice/historySlice';
import { useAuth } from '@/src/hooks/useAuth';
import LoadPage from '@/src/components/ui/loadpage';

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [currentRequest, setCurrentRequest] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const { loading } = useAuth();
    const selectedProperty = 1;
    const mockData: reviewData[] = Array.from({ length: 30 }, (_, index) => ({
        name: `Lessee Name ${index + 1}`,
        reviewedAt: `2025-04-${(index % 30) + 1}T12:00:00Z`, // Example timestamp (modify for real data)
        message: `This is a review message for lessee ${index + 1}.`,
        imageURL: `https://example.com/images/image${index + 1}.jpg`,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
        id: index + 1,
        lesseeID: index + 1,
    }));
    const [tableData, setTableData] = useState<reviewData[]>(mockData);
    const [filteredData, setFilteredData] = useState<reviewData[]>([]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const requestDatas = await getReviewData(selectedProperty ? selectedProperty : -1);
    //             setTableData(requestDatas);
    //			   setFilteredData(tableData);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     // fetchData()
    //     fetchData();
    // }, [dispatch]);

    if (loading) return <LoadPage></LoadPage>;
    // if (error) return <div>Error: {error}</div>

    const handleSort = (column: 'name' | 'rating' | 'reviewedAt') => {
        const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newOrder);

        const sortedData = [...filteredData].sort((a, b) => {
            if (column === 'name') {
                return newOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (column === 'rating') {
                return newOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
            } else if (column === 'reviewedAt') {
                return newOrder === 'asc'
                    ? new Date(a.reviewedAt).getTime() - new Date(b.reviewedAt).getTime()
                    : new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime();
            }
            return 0;
        });
        setCurrentRequest(null);
        setFilteredData(sortedData);
    };
    const search = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const searchValue = (event.target as HTMLInputElement).value;

            // Filter the properties based on the input value
            const filtered = tableData.filter((property) =>
                property.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };
    return (
        <div className=" flex w-full flex-col items-center rounded-md">
            <Header />
            <div className="flex w-[72.72vw] h-[53rem] p-[0.625rem] flex-col items-start gap-[0.625rem] flex-shrink-0">
                <input
                    className="flex w-[20rem] h-[40px] min-h-[40px] max-h-[40px] py-2 px-3 justify-between items-center flex-1 rounded-md bg-gray-200 outline-none text-black"
                    placeholder="Search Property"
                    onKeyDown={search}
                />

                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-full rounded-lg bg-slate-50">
                        <div className="flex w-full bg-white rounded-t-lg text-slate-400 border-b border-gray-200">
                            <div
                                className="px-6 py-3 text-left w-[37%] flex items-center"
                                onClick={() => handleSort('name')}
                            >
                                <div>Property Name</div>
                                <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1rem"
                                        height="1rem"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M14.5 10.6665L11.8333 13.3332M11.8333 13.3332L9.16667 10.6665M11.8333 13.3332V2.6665M2.5 5.33317L5.16667 2.6665M5.16667 2.6665L7.83333 5.33317M5.16667 2.6665V13.3332"
                                            stroke="#94A3B8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div
                                className="px-6 py-3 text-left w-[20%] flex items-center"
                                onClick={() => handleSort('name')}
                            >
                                <div>Reviewer</div>
                                <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1rem"
                                        height="1rem"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M14.5 10.6665L11.8333 13.3332M11.8333 13.3332L9.16667 10.6665M11.8333 13.3332V2.6665M2.5 5.33317L5.16667 2.6665M5.16667 2.6665L7.83333 5.33317M5.16667 2.6665V13.3332"
                                            stroke="#94A3B8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div
                                className="px-6 py-3 text-left w-[28%] flex items-center"
                                onClick={() => handleSort('reviewedAt')}
                            >
                                <div>Reviewed at</div>
                                <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1rem"
                                        height="1rem"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M14.5 10.6665L11.8333 13.3332M11.8333 13.3332L9.16667 10.6665M11.8333 13.3332V2.6665M2.5 5.33317L5.16667 2.6665M5.16667 2.6665L7.83333 5.33317M5.16667 2.6665V13.3332"
                                            stroke="#94A3B8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="px-6 py-3 text-left w-[15%]">Detail</div>
                        </div>

                        {/* Table Body */}
                        <div className="w-full h-[calc(100%-96px)] overflow-y-auto text-slate-600">
                            <div className="w-full">
                                {filteredData.map((row, index) => (
                                    <div
                                        key={index}
                                        className="flex w-full bg-white h-[56px] items-center border border-gray-200"
                                    >
                                        <div className="px-6 w-[37%]">{row.name}</div>
                                        <div className="px-6 w-[20%]">{row.name}</div>
                                        <div className="px-6 w-[28%]">
                                            {' '}
                                            {new Date(row.reviewedAt).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                timeZone: 'UTC',
                                            })}
                                        </div>
                                        <div className="px-6 w-[15%]">
                                            <button
                                                className="px-4 py-2 text-sm text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 border-blue-900 border"
                                                onClick={() => setCurrentRequest(index)}
                                            >
                                                View Detail
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/*Gray Space*/}
                        <div className="h-12 w-full"></div>
                    </div>

                    {/*Slider*/}
                    {currentRequest != null && (
                        <Slider
                            id={'0'}
                            totalRequests={filteredData.length}
                            currentRequest={currentRequest}
                            setCurrentRequest={setCurrentRequest}
                            tableData={filteredData}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
