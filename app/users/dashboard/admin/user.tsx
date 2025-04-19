'use client';
import { getReviewDataForAdmin, reviewDataForAdmin } from '@/src/api/data/review';
import { useEffect, useState } from 'react';
// import { fetchUserInfo } from '@/store/authSlice'
import Slider from './slider';
import { useAuth } from '@/src/hooks/useAuth';
import LoadPage from '@/src/components/ui/loadpage';
import Footer from '../lessor/components/Footer';
import { getUserData, userData } from '@/src/api/data/user';

export default function UserDashboard() {
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [currentRequest, setCurrentRequest] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
    const [query, setQuery] = useState<string>('');
    const { loading } = useAuth();
    const [deleting, setDeleting] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<userData[]>([]);
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
    const [tableData, setTableData] = useState<userData[]>([]);
    // const [filteredData, setFilteredData] = useState<reviewDataForAdmin[]>([]);
    const fetchData = async () => {
        try {
            const userDatas = await getUserData();
            setTableData(userDatas);
            setFilteredData(userDatas);
            // setFilteredData(tableData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const fetchAfterDel = async () => {
        fetchData();
    };
    if (loading || deleting) return <LoadPage></LoadPage>;
    // if (error) return <div>Error: {error}</div>

    const handleSort = (column: 'name' | 'role' | 'status') => {
        const newOrder = sortColumn === column && sortOrder === 'ASC' ? 'DESC' : 'ASC';
        setSortColumn(column);
        setSortOrder(newOrder);
        const sortedData = [...filteredData].sort((a, b) => {
            if (column === 'name') {
                return newOrder === 'ASC' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (column === 'role') {
                return newOrder === 'ASC' ? a.name.localeCompare(b.role) : b.role.localeCompare(a.role);
            } else if (column === 'status') {
                return newOrder === 'ASC'
                    ? new Date(a.status).getTime() - new Date(b.status).getTime()
                    : new Date(b.status).getTime() - new Date(a.status).getTime();
            }
            return 0;
        });
        setTableData(sortedData);
    };
    const search = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const searchValue = event.currentTarget.value.toLowerCase();
            const results = tableData.filter((item) => item.name.toLowerCase().includes(searchValue));
            setFilteredData(results);
        }
    };
    return (
        <div className=" flex w-full flex-col items-center rounded-md">
            <div className="flex w-[72.72vw] h-[53rem] p-[0.625rem] flex-col items-start gap-[0.625rem] flex-shrink-0">
                <input
                    className="flex w-[20rem] h-[40px] min-h-[40px] max-h-[40px] py-2 px-3 justify-between items-center flex-1 rounded-md bg-gray-200 outline-none text-black"
                    placeholder="Search User"
                    onKeyDown={search}
                />

                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-full rounded-lg bg-slate-50">
                        <div className="flex w-full bg-white rounded-t-lg text-slate-400 border-b border-gray-200">
                            <div
                                className="px-6 py-3 text-left w-[37%] flex items-center"
                                onClick={() => handleSort('name')}
                            >
                                <div>User Name</div>
                                <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem] cursor-pointer">
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
                                onClick={() => handleSort('role')}
                            >
                                <div>User Role</div>
                                <div className="flex pl-[0.5rem] justify-center items-center gap-[0.625rem] cursor-pointer">
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
                                className="px-6 py-3 text-left w-[28%] flex items-center cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                <div>Status</div>
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
                            <div className="flex px-6 py-3 text-left w-[15%] justify-center">Manage</div>
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
                                        <div className="px-6 w-[20%]">{row.role}</div>
                                        <div className="px-6 w-[28%]">
                                            {row.status === 'active' ? 'Active' : 'Banned'}
                                        </div>
                                        <div className="flex w-[15%] justify-center">
                                            <button
                                                className={`py-2 text-xs font-medium rounded-lg border w-[30%] 
													${
                                                        row.status === 'active'
                                                            ? 'text-red-700 bg-white hover:bg-red-100 border-red-700'
                                                            : 'text-green-700 bg-white hover:bg-green-100 border-green-700'
                                                    }`}
                                                onClick={() => setCurrentRequest(index)}
                                            >
                                                {row.status === 'active' ? 'Ban' : 'Activate'}
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
                    {/* {currentRequest != null && (
                        <Slider
                            id={'0'}
                            totalRequests={tableData.length}
                            currentRequest={currentRequest}
                            setCurrentRequest={setCurrentRequest}
                            tableData={tableData}
                            setDeleting={setDeleting}
                            onAfterDelete={fetchAfterDel}
                        />
                    )} */}
                </div>
            </div>
        </div>
    );
}
