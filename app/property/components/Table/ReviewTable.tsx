import { getReviewData, reviewData } from '@/src/api/data/review';
import Rating from '@mui/material/Rating';
import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import ReviewSlider from '../Slider/ReviewSlider';
import { useAppSelector } from '@/store/hooks';
const ReviewTable: React.FC = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [tableData, setTableData] = useState<reviewData[]>([]);
    const [currentRequest, setCurrentRequest] = useState<number | null>(null);
    const totalPages = tableData ? Math.ceil(tableData.length / rowsPerPage) : 1;
    const { selectedProperty } = useAppSelector((state) => state.property);
    // Fetch all data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestDatas = await getReviewData(selectedProperty ? selectedProperty.id : -1);
                setTableData(requestDatas);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedProperty]);

    const handleSort = (column: 'name' | 'rating' | 'reviewedAt') => {
        const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newOrder);

        const sortedData = [...tableData].sort((a, b) => {
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
        setTableData(sortedData);
    };

    useEffect(() => {
        handleSort('name');
    }, []);

    const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-full rounded-lg bg-slate-50">
                <div className="flex w-full bg-white rounded-t-lg text-slate-400 border-b border-gray-200">
                    <div className="px-6 py-3 text-left w-[40%]" onClick={() => handleSort('name')}>
                        Name {sortColumn === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                    </div>
                    <div className="px-6 py-3 text-left w-[20%]" onClick={() => handleSort('rating')}>
                        Rating {sortColumn === 'rating' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                    </div>
                    <div className="px-6 py-3 text-left w-[25%]" onClick={() => handleSort('reviewedAt')}>
                        Reviewed At {sortColumn === 'reviewedAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                    </div>
                    <div className="px-6 py-3 text-left w-[15%]">Detail</div>
                </div>

                {/* Table Body */}
                <div className="w-full h-[calc(100%-96px)] overflow-y-auto text-slate-600">
                    <div className="w-full">
                        {paginatedData.map((row, index) => (
                            <div
                                key={index}
                                className="flex w-full bg-white h-[56px] items-center border border-gray-200"
                            >
                                <div className="px-6 w-[40%]">{row.name}</div>
                                <div className="px-6 w-[20%] flex items-center gap-x-1">
                                    <p>{row.rating.toFixed(1)}</p>
                                    <Rating name="read-only" value={row.rating} readOnly size="small" />
                                </div>
                                <div className="px-6 w-[25%]">
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
                <div className="h-12 w-full border-t border-gray-200"></div>
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
                <ReviewSlider
                    id={'0'}
                    totalRequests={tableData.length}
                    currentRequest={currentRequest}
                    setCurrentRequest={setCurrentRequest}
                    tableData={tableData}
                />
            )}
        </div>
    );
};

export default ReviewTable;
