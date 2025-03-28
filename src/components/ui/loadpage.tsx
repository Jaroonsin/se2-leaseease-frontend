import React from 'react';

const LoadPage: React.FC = () => (
    <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
            <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <p className="mt-4 text-gray-700">Loading...</p>
        </div>
    </div>
);

export default LoadPage;
