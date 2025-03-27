'use client';
import React, { useState } from 'react';

interface ButtonGroupProps {
    buttons: string[];
    onClick?: (activeButton: string) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons, onClick }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index: number) => {
        setActiveIndex(index);
        if (onClick) {
            onClick(buttons[index]);
        }
    };

    return (
        <div className="flex h-[40px] w-[250px] p-1 px-3 justify-center items-center gap-2.5 rounded-lg bg-zinc-100">
            {buttons.map((button, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(index)}
                    className={`w-[73px] h-[38px] rounded-md ${
                        index === activeIndex ? 'bg-white text-slate-900' : 'text-slate-500 hover:bg-gray-200'
                    } `}
                >
                    {button}
                </button>
            ))}
        </div>
    );
};

export default ButtonGroup;
