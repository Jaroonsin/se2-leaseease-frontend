// properties active css

import { Property } from '@/store/propertySlice';

type ChildProps = {
    property: Property;
    isPropertyActive: boolean;
    onClick: () => void;
};

export default function PropertySingle({ property, isPropertyActive, onClick }: ChildProps) {
    return (
        <button
            className={`flex py-2 px-[10px] items-center gap-2 self-stretch ${
                isPropertyActive ? 'bg-[#E2E8F0]' : 'hover:bg-[#F1F5F9]'
            }`}
            onClick={onClick}
        >
            <div
                className="w-[40px] h-[40px] rounded-[6px] bg-[length:199.261%_100%] bg-no-repeat bg-[position:-19.615px_0]"
                style={{
                    backgroundImage: `url(${property.image_url})`,
                    backgroundSize: '199.261% 100%',
                    backgroundPosition: '-19.615px 0',
                }}
            ></div>

            <div className="flex flex-col items-start flex-1">
                <div className="flex items-center gap-1 self-stretch">
                    <p
                        className="max-w-[264px] text-[#0F172A] text-sm font-medium leading-[20px]"
                        style={{ fontFamily: 'Inter' }}
                    >
                        {property.name}
                    </p>
                    <div className="flex items-center gap-[1px] flex-1">
                        <p
                            className="text-[#94A3B8] text-xs font-normal leading-[16px]"
                            style={{ fontFamily: 'Inter' }}
                        >
                            {property.rating}
                        </p>
                        <div className="flex w-[14px] h-[14px] justify-center items-center">
                            <div className="w-[14px] h-[14px] flex-shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path
                                        d="M7.00033 1.16663L8.80283 4.81829L12.8337 5.40746L9.91699 8.24829L10.6053 12.2616L7.00033 10.3658L3.39533 12.2616L4.08366 8.24829L1.16699 5.40746L5.19783 4.81829L7.00033 1.16663Z"
                                        fill="#FACC15"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-stretch">
                    <p className="text-[#94A3B8] text-sm font-normal leading-[20px]" style={{ fontFamily: 'Inter' }}>
                        {property.location}
                    </p>
                </div>
            </div>
        </button>
    );
}
