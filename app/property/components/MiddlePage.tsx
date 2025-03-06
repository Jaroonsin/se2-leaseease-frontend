'use client';
import React from 'react';
import Table from './Table';
import ButtonGroup from './ButtonGroup';
import PropertyDescription from './PropertyDescription';
import { useAppSelector } from '@/store/hooks';

export default function MiddlePage() {
    const { selectedProperty } = useAppSelector((state) => state.property);
    if (!selectedProperty) {
        return <p className="flex items-center justify-center text-center m-auto">Select a property to view details</p>;
    }

    if (!selectedProperty) {
        return <p className="flex items-center justify-center text-center m-auto">Property not found.</p>;
    }

    const handleButtonClick = (activeButton: string) => {
        console.log('Active button:', activeButton);
    };

    return (
        <div>
            <PropertyDescription />

            <div className="flex flex-col items-start gap-5 flex-1 self-stretch my-[20px]">
                <ButtonGroup buttons={['Request', 'Lessee', 'Review']} onClick={handleButtonClick} />
            </div>

            <Table />
        </div>
    );
}
