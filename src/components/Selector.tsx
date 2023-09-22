import React, { useEffect, useRef, useState } from 'react';
import { clsx as cx } from 'clsx';
import { OptionsDataProps } from '../libs/data';

type DropdownProps = {
  options: string[];
  initialValue: string | undefined;
  onSelect: React.Dispatch<React.SetStateAction<string | undefined>>;
  size: 'small' | 'normal' | 'large';
  title: string;
};

function Selector({
  options,
  initialValue,
  onSelect,
  size,
  title,
}: DropdownProps) {
  const selectSytle = cx(
    'border-2 py-1.5 px-2 text-[#333333] text-sm font-NotoSansTC font-normal',
  );

  const selectorSize = { small: 'w-20', normal: 'w-28', large: 'w-40' };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    initialValue,
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const onCloseSide = () => setIsOpen(false);
  const stopProp = (e: React.MouseEvent) => e.stopPropagation();
  const toggleDropdown = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!sidebarRef.current?.contains(e.target as Node | null)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef, isOpen]);

  return (
    <div
      ref={sidebarRef}
      onClick={onCloseSide}
      className={cx(selectorSize[size], 'inline-block relative text-left')}
      aria-hidden="true"
    >
      <div className="relative w-full" onClick={stopProp} aria-hidden="true">
        <span className="absolute -top-1.5 left-3 px-1 text-xs text-center text-gray-500 bg-white">
          {title}
        </span>
        <button
          onClick={toggleDropdown}
          type="button"
          className="inline-flex justify-between p-3 w-full text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:border-primary-100"
          id="options-menu"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="options-menu"
        >
          <p className="font-normal font-NotoSansTC">{selectedOption}</p>
          <svg
            className="ml-2 -mr-1 w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path fill="currentColor" d="m12 15l-5-5h10l-5 5Z" />
          </svg>
        </button>

        {isOpen && (
          <div className="overflow-y-auto absolute right-0 z-30 mt-0.5 w-full max-h-64 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="block py-2 px-4 text-gray-700 cursor-pointer hover:text-gray-900 hover:bg-gray-100 active:bg-secondary-300"
                  aria-hidden="true"
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Selector;
