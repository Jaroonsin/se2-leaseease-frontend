"use client";
import React, { useState } from "react";
import Table from "./Table";
import ButtonGroup from "./ButtonGroup";
import PropertyDescription from "./PropertyDescription";
// import { Property } from '@/type/Property'
import { Property} from "@/store/propertySlice";

type PropertyDescriptionProps = {
    selectedProperty: Property | null;
    setSelectedProperty: React.Dispatch<React.SetStateAction<Property|null>>;
}

export default function MiddlePage({ selectedProperty, setSelectedProperty }: PropertyDescriptionProps) {
    if (!selectedProperty) {
        return <p className="flex items-center justify-center text-center m-auto">Select a property to view details</p>;
    }

    const handleButtonClick = (activeButton: string) => {
        console.log("Active button:", activeButton);
    };

    return (
        <div>
            <PropertyDescription
                Property={selectedProperty}
                setSelectedProperty={setSelectedProperty}
            />

            <div className="flex flex-col items-start gap-5 flex-1 self-stretch my-[20px]">
                <ButtonGroup buttons={["Request", "Lessee", "Review"]} onClick={handleButtonClick} />
            </div>

            <Table />
        </div>
    );
};

