// finished

"use client"
import { useState, useRef, useEffect } from "react"
import SortOption from "./SortOption"
import PropertySingle from "./PropertySingle"
import CreateNewProperty from "./CreateNewProperty"
import { getAllProperties } from "@/src/api/property"
import { Property } from '../../../type/Property'

type PropertySidebarProps = {
    setSelectedPropertyID: React.Dispatch<React.SetStateAction<number|null>>; 
    properties: Property[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>; 
};

export default function PropertySidebar({ setSelectedPropertyID, properties, setProperties }: PropertySidebarProps) {
    const [isSortOptionVisible, setIsSortOptionVisible] = useState<boolean>(false)
    const [isCreateNewPropertyVisible, setIsCreateNewPropertyVisible] = useState<boolean>(false)
    const [selectedSort, setSelectedSort] = useState<string>("A-Z")
    // const [properties, setProperties] = useState<Property[]>([])


    const sortOptionRef = useRef<HTMLDivElement>(null)

    const toggleSortOption = (): void => {
        setIsSortOptionVisible(!isSortOptionVisible)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortOptionRef.current && !sortOptionRef.current.contains(event.target as Node)) {
                setIsSortOptionVisible(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        fetchAllProperties()

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const fetchAllProperties = async () => {
        try {
            const data: Property[] = await getAllProperties() || []
            if (data) {
                console.log("Fetched Properties:", data)

                const data_random: Property[] = data.map((property, index) => ({
                    ...property,
                    rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
                    reviews: Math.floor(Math.random() * 500) + 1,
                    image: `https://loremflickr.com/2048/1280?random=${index + 1}`,
                    date: new Date(Date.now() + Math.random() * 31536000000)
                        .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                        .replace(",", ""),
                }))

                setProperties(data_random)
            } else {
                console.error("Failed to fetch properties.")
            }
        } catch (error) {
            console.error("Error fetching properties:", error)
        }
    }

    // const properties: Property[] = Array.from({ length: 15 }, (_, i) => {
    //     const randomDate = new Date(Date.now() + Math.random() * 31536000000)
    //         .toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    //         .replace(",", "")

    //     return {
    //         id: i + 1,
    //         name: [
    //             "Luxury Condo",
    //             "Cozy Apartment",
    //             "Modern House",
    //             "Beachfront Villa",
    //             "Penthouse Suite",
    //             "Urban Studio",
    //             "Rustic Cabin",
    //             "High-Rise Loft",
    //             "Lakeview Cottage",
    //             "Garden Bungalow",
    //         ][i % 10],

    //         rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
    //         location: [
    //             "Sathorn, Bangkok",
    //             "Jatujak, Bangkok",
    //             "Ekkamai, Bangkok",
    //             "Phuket, Thailand",
    //             "Silom, Bangkok",
    //             "Chiang Mai, Thailand",
    //             "Hua Hin, Thailand",
    //             "Pattaya, Thailand",
    //             "Samui, Thailand",
    //             "Krabi, Thailand",
    //         ][i % 10],

    //         size: Math.floor(Math.random() * (200 - 30 + 1) + 30) + " sqm",
    //         price: `$${(Math.random() * (500000 - 50000) + 50000).toLocaleString()}`,
    //         date: randomDate,
    //         image: `https://loremflickr.com/2048/1280?random=${i + 1}`,
    //         reviews: Math.floor(Math.random() * 500) + 1
    //     }
    // })

    const sortedProperties = [...properties].sort((a, b) => {
        switch (selectedSort) {
            case "A-Z":
                return a.name.localeCompare(b.name)
            case "Z-A":
                return b.name.localeCompare(a.name)
            case "Most Popular":
                return b.rating - a.rating
            case "Least Popular":
                return a.rating - b.rating
            case "Newest":
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            case "Oldest":
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            default:
                return 0
        }
    })

    const [activeProperty, setActiveProperty] = useState<number | null>(null)

    return (
        <div className="flex w-[25rem] h-[calc(100vh-4rem)] p-[1rem] 1rem flex-col items-center gap-[0.5rem] self-stretch border-slate-300 bg-slate-50">
            <div className="flex justify-center items-center gap-[0.5rem] self-stretch">
                <input className="flex h-[40px] min-h-[40px] max-h-[40px] py-2 px-3 justify-between items-center flex-1 rounded-md bg-gray-200 outline-none" placeholder="Select Property" />
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] cursor-pointer" viewBox="0 0 16 16" fill="none" onClick={toggleSortOption}>
                        <path d="M14 10.6667L11.3333 13.3334M11.3333 13.3334L8.66667 10.6667M11.3333 13.3334V2.66675M2 5.33341L4.66667 2.66675M4.66667 2.66675L7.33333 5.33341M4.66667 2.66675V13.3334" stroke="#64748B" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <SortOption selectedSort={selectedSort} setSelectedSort={setSelectedSort} ref={sortOptionRef} isSortOptionVisible={isSortOptionVisible} />
                </div>
            </div>

            <div className="flex py-0 flex-col items-center gap-1 self-stretch overflow-y-auto">
                {sortedProperties.map((property: Property) => (
                    <PropertySingle
                        key={property.id}
                        property={property}
                        isPropertyActive={property.id === activeProperty}
                        onClick={() => {
                            setActiveProperty(property.id)
                            setSelectedPropertyID(property.id)
                        }}
                    />
                ))}
                <button onClick={() => setIsCreateNewPropertyVisible(!isCreateNewPropertyVisible)} className="flex h-[40px] py-2 px-[10px] justify-center items-center gap-2 self-stretch rounded-[6px] border border-[#1E3A8A] mt-2 sticky bottom-0 bg-white hover:bg-[#EFF6FF]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" viewBox="0 0 16 16" fill="none">
                        <path d="M3.33301 8H12.6663M7.99967 3.33333V12.6667" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-[#1E3A8A] text-xs font-semibold leading-[16px]">
                        Create new property
                    </p>
                </button>
            </div>
            {isCreateNewPropertyVisible && <CreateNewProperty
                setIsCreateNewPropertyVisible={setIsCreateNewPropertyVisible}
                addProperty={(property) => setProperties((prev) => [...prev, property])}
            />}
        </div>
    )
}