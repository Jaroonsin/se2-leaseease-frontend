import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { getRequestData, requestData } from '@/src/api/data/request';
import Footer from '../Footer';
import RequestSlider from '../Slider/RequestSlider';
import { useAppSelector } from '@/store/hooks';

const RequestTable: React.FC = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [tableData, setTableData] = useState<requestData[]>([]);
    const [currentRequest, setCurrentRequest] = useState<number | null>(null);
    const totalPages = tableData ? Math.ceil(tableData.length / rowsPerPage) : 1;
    const { selectedProperty } = useAppSelector((state) => state.property);
    // Fetch all data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestDatas = await getRequestData(selectedProperty ? selectedProperty.id : -1);
                setTableData(requestDatas);
                console.log(requestDatas);
                console.log(requestDatas[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentRequest, selectedProperty]);
    const handleSort = (column: 'name' | 'requestedAt') => {
        const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newOrder);
        const sortedData = !tableData
            ? []
            : [...tableData].sort((a, b) => {
                  if (column === 'name') {
                      return newOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                  } else if (column === 'requestedAt') {
                      return newOrder === 'asc'
                          ? new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
                          : new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
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
                    <div className="px-6 py-3 text-left w-[55%]" onClick={() => handleSort('name')}>
                        Name {sortColumn === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                    </div>
                    <div className="px-6 py-3 text-left w-[30%]" onClick={() => handleSort('requestedAt')}>
                        Requested At {sortColumn === 'requestedAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
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
                                <div className="px-6 w-[55%]">{row.name}</div>
                                <div className="px-6 w-[30%]">
                                    {new Date(row.requestedAt).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'UTC',
                                    })}
                                </div>
                                <div className="px-6 w-w-[15%]">
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
                <RequestSlider
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

export default RequestTable;
