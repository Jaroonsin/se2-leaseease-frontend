'use client';
import { getReviewDataForAdmin, reviewDataForAdmin } from '@/src/api/data/review';
import { useEffect, useRef, useState } from 'react';
import Header from '@/app/users/dashboard/components/Header';
// import { fetchUserInfo } from '@/store/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store/store';
import Slider from './slider';
import { fetchReservations } from '@/src/store/slice/historySlice';
import { useAuth } from '@/src/hooks/useAuth';
import LoadPage from '@/src/components/ui/loadpage';
import Footer from '../lessor/components/Footer';

export default function AdminDashboard() {
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [currentRequest, setCurrentRequest] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
    const [query, setQuery] = useState<string>('');
    const { loading } = useAuth();
    const [deleting, setDeleting] = useState<boolean>(false);
    const [rowsPerPage, setRowsPerPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPage] = useState<number>(1);
    // const mockData: reviewDataForAdmin[] = Array.from({ length: 30 }, (_, index) => ({
    //     name: `Lessee Name ${index + 1}`,
    //     reviewedAt: `2025-04-${(index % 30) + 1}T12:00:00Z`, // Example timestamp (modify for real data)
    //     message: `This is a review message for lessee ${index + 1}.`,
    //     imageURL: `https://example.com/images/image${index + 1}.jpg`,
    //     rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
    //     id: index + 1,
    //     lesseeID: index + 1,
    //     pname: `random ${30 - index}.`,
    // }));
    const [tableData, setTableData] = useState<reviewDataForAdmin[]>([]);
    // const [filteredData, setFilteredData] = useState<reviewDataForAdmin[]>([]);
    const fetchData = async (sortColumn: string, sortOrder: string) => {
        try {
            const [requestDatas, totalPages] = await getReviewDataForAdmin(
                currentPage,
                rowsPerPage,
                query,
                sortColumn,
                sortOrder
            );
            console.log(requestDatas);
            console.log(143);
            console.log(totalPages);
            setTableData(requestDatas);
            setTotalPage(totalPages);
            // setFilteredData(tableData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData(sortColumn, sortOrder);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchData(sortColumn, sortOrder);
    }, [rowsPerPage]);
    const fetchAfterDel = async () => {
        fetchData(sortColumn, sortOrder);
    };
    if (loading || deleting) return <LoadPage></LoadPage>;
    // if (error) return <div>Error: {error}</div>

    const handleSort = (column: 'name' | 'reviewer' | 'time') => {
        const newOrder = sortColumn === column && sortOrder === 'ASC' ? 'DESC' : 'ASC';
        setSortColumn(column);
        setSortOrder(newOrder);
        // const sortedData = [...filteredData].sort((a, b) => {
        //     if (column === 'property_name') {
        //         return newOrder === 'asc' ? a.pname.localeCompare(b.pname) : b.pname.localeCompare(a.pname);
        //     } else if (column === 'reviewer') {
        //         return newOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        //     } else if (column === 'time') {
        //         return newOrder === 'asc'
        //             ? new Date(a.reviewedAt).getTime() - new Date(b.reviewedAt).getTime()
        //             : new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime();
        //     }
        //     return 0;
        // });
        setCurrentRequest(null);
        fetchData(column, newOrder);
    };
    const search = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const searchValue = (event.target as HTMLInputElement).value;
            setQuery(searchValue);
            fetchData(sortColumn, sortOrder);
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
                                onClick={() => handleSort('reviewer')}
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
                                onClick={() => handleSort('time')}
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
                                {tableData.map((row, index) => (
                                    <div
                                        key={index}
                                        className="flex w-full bg-white h-[56px] items-center border border-gray-200"
                                    >
                                        <div className="px-6 w-[37%]">{row.pname}</div>
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
                    {/*Footer*/}
                    <Footer
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                    {/*Slider*/}
                    {currentRequest != null && (
                        <Slider
                            id={'0'}
                            totalRequests={tableData.length}
                            currentRequest={currentRequest}
                            setCurrentRequest={setCurrentRequest}
                            tableData={tableData}
                            setDeleting={setDeleting}
                            onAfterDelete={fetchAfterDel}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
