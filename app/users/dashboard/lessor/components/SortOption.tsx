import { forwardRef } from 'react';

type SortOptionProps = {
    selectedSort: string;
    setSelectedSort: (sort: string) => void;
    isSortOptionVisible: boolean;
};

const SortOption = forwardRef<HTMLDivElement, SortOptionProps>(
    ({ selectedSort, setSelectedSort, isSortOptionVisible }: SortOptionProps, ref) => {
        if (!isSortOptionVisible) return null;

        return (
            <div
                ref={ref}
                className="absolute right-0 top-full mt-1 w-32 flex flex-col items-start rounded-md border border-slate-200 bg-white shadow-md z-10"
            >
                <div className="flex flex-col items-start self-stretch p-1">
                    <button
                        className={`flex h-8 items-center self-stretch rounded-sm px-2 text-xs ${
                            selectedSort === 'A-Z' ? 'bg-[#E2E8F0]' : 'hover:bg-[#F1F5F9]'
                        }`}
                        onClick={() => setSelectedSort('A-Z')}
                    >
                        <div className="flex items-center gap-[0.625rem] flex-1">A-Z</div>
                    </button>
                    <button
                        className={`flex h-8 items-center self-stretch rounded-sm px-2 text-xs ${
                            selectedSort === 'Z-A' ? 'bg-[#E2E8F0]' : 'hover:bg-[#F1F5F9]'
                        }`}
                        onClick={() => setSelectedSort('Z-A')}
                    >
                        <div className="flex items-center gap-[0.625rem] flex-1">Z-A</div>
                    </button>
                </div>
                <div className="flex flex-col items-start self-stretch">
                    <div className="w-full h-[0.0625rem] bg-slate-200"></div>
                </div>
                <div className="flex flex-col items-start self-stretch p-1">
                    <button
                        className={`flex h-8 items-center self-stretch rounded-sm px-2 text-xs ${
                            selectedSort === 'Most Popular' ? 'bg-[#E2E8F0]' : 'hover:bg-[#F1F5F9]'
                        }`}
                        onClick={() => setSelectedSort('Most Popular')}
                    >
                        <div className="flex items-center gap-[0.625rem] flex-1">Most Popular</div>
                    </button>
                    <button
                        className={`flex h-8 items-center self-stretch rounded-sm px-2 text-xs ${
                            selectedSort === 'Least Popular' ? 'bg-[#E2E8F0]' : 'hover:bg-[#F1F5F9]'
                        }`}
                        onClick={() => setSelectedSort('Least Popular')}
                    >
                        <div className="flex items-center gap-[0.625rem] flex-1">Least Popular</div>
                    </button>
                </div>
                <div className="flex flex-col items-start self-stretch">
                    <div className="w-full h-[0.0625rem] bg-slate-200"></div>
                </div>
                <div className="flex flex-col items-start self-stretch p-1">
                    <button
                        className={`flex h-8 items-center self-stretch rounded-sm px-2 text-xs ${
                            selectedSort === 'Newest' ? 'bg-[#E2E8F0]' : 'hover:bg-[#F1F5F9]'
                        }`}
                        onClick={() => setSelectedSort('Newest')}
                    >
                        <div className="flex items-center gap-[0.625rem] flex-1">Newest</div>
                    </button>
                    <button
                        className={`flex h-8 items-center self-stretch rounded-sm px-2 text-xs ${
                            selectedSort === 'Oldest' ? 'bg-[#E2E8F0]' : 'hover:bg-[#F1F5F9]'
                        }`}
                        onClick={() => setSelectedSort('Oldest')}
                    >
                        <div className="flex items-center gap-[0.625rem] flex-1">Oldest</div>
                    </button>
                </div>
            </div>
        );
    }
);

export default SortOption;
