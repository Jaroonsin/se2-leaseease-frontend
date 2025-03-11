import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface footerProps {
    rowsPerPage: number;
    setRowsPerPage: Dispatch<SetStateAction<number>>;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    totalPages: number;
}

const Footer: React.FC<footerProps> = ({ rowsPerPage, setRowsPerPage, currentPage, setCurrentPage, totalPages }) => {
    return (
        <div className="flex justify-end items-start gap-3 align-self-stretch text-black">
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

            <button
                className="border border-gray-300 rounded-md px-2 py-1 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={16} />
            </button>

            <button
                className="border border-gray-300 rounded-md px-2 py-1 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Footer;
