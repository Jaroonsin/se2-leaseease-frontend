import { getLesseeData, lesseeData } from '@/src/api/data/lessee';
import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import LesseeSlider from '../Slider/LesseeSlider';
import { useAppSelector } from '@/store/hooks';

const LesseeTable: React.FC = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [tableData, setTableData] = useState<lesseeData[]>([]);
    const [currentRequest, setCurrentRequest] = useState<number | null>(null);
    const totalPages = tableData ? Math.ceil(tableData.length / rowsPerPage) : 1;
    const { selectedProperty } = useAppSelector((state) => state.property);
    // Fetch all data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestDatas = await getLesseeData(selectedProperty ? selectedProperty.id : -1);
                setTableData(requestDatas);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedProperty]);

    const handleSort = (column: 'name' | 'rating' | 'lastResponse') => {
        const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newOrder);

        const sortedData = [...tableData].sort((a, b) => {
            if (column === 'name') {
                return newOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (column === 'lastResponse') {
                return newOrder === 'asc'
                    ? new Date(a.lastResponse).getTime() - new Date(b.lastResponse).getTime()
                    : new Date(b.lastResponse).getTime() - new Date(a.lastResponse).getTime();
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
                    <div className="px-6 py-3 text-left w-[45%]" onClick={() => handleSort('name')}>
                        Name {sortColumn === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                    </div>
                    <div className="px-6 py-3 text-left w-[20%]" onClick={() => handleSort('lastResponse')}>
                        Last Response {sortColumn === 'lastResponse' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                    </div>
                    <div className="px-6 py-3 text-left w-[20%]">Status</div>
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
                                <div className="px-6 w-[45%]">{row.name}</div>
                                <div className="px-6 w-[20%]">
                                    {' '}
                                    {new Date(row.lastResponse).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'UTC',
                                    })}
                                </div>
                                <div className="px-6 w-[20%]">
                                    <div className="px-4 py-2 text-sm font-bold text-green-900 bg-green-100 rounded-full inline-block">
                                        Active
                                    </div>
                                </div>
                                <div className="px-6 w-[15%]">
                                    <button
                                        className="px-4 py-2 text-sm text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 border-blue-900 border"
                                        onClick={() => setCurrentRequest(0)}
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
                <LesseeSlider
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

export default LesseeTable;
