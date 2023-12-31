import React, { useEffect, useRef, useState } from 'react';
import { clsx as cx } from 'clsx';
import { IcTwotoneClose, MsArrowDropDown } from './Icons';

export type SelectorProps = {
  options: string[];
  initialValue: string | undefined;
  onSelect: React.Dispatch<React.SetStateAction<string | undefined>>;
  size: 'small' | 'normal' | 'large';
  title: string;
  isDisabled?: boolean;
  isRelative?: boolean;
  selectedCity?: string;
  isAutoDistrict?: boolean;
};

function Selector({
  options,
  initialValue,
  onSelect,
  size,
  title,
  isDisabled = false,
  isRelative = false,
  isAutoDistrict = false,
  selectedCity,
}: SelectorProps) {
  const selectorSize = {
    small: 'w-20',
    normal: 'w-28',
    large: 'w-full md:w-48',
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    initialValue || '',
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

  const handleClearSelect = () => {
    setSelectedOption('');
    onSelect('');
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

  const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

  useEffect(() => {
    if (isRelative) {
      if (selectedCity === '' || selectedCity === '請選擇 縣/市') {
        setSelectedOption('請先選擇 縣/市');
      } else if (isAutoDistrict) {
        const randomOption = options[randomNumber(0, options?.length || 1 - 1)];
        setSelectedOption(randomOption);
        onSelect(randomOption);
      } else {
        setSelectedOption('');
        onSelect('');
      }
    }
  }, [selectedCity, isRelative, isAutoDistrict, onSelect, options]);

  return (
    <div
      ref={sidebarRef}
      onClick={onCloseSide}
      className={cx(
        selectorSize[size],
        'inline-block relative text-left',
        isDisabled ? 'hover:cursor-not-allowed' : '',
      )}
      aria-hidden="true"
    >
      <div className="relative w-full" onClick={stopProp} aria-hidden="true">
        <div>
          {size === 'large'
            && selectedOption !== ''
            && selectedOption !== '請選擇 縣/市'
            && selectedOption !== '請先選 擇縣/市' && (
              <button
                type="button"
                onClick={handleClearSelect}
                className={cx(
                  isDisabled
                    ? 'text-gray-300/80'
                    : 'text-gray-700 hover:text-tertiary-200',
                  'absolute right-10 top-[1.18rem] z-[1]',
                )}
              >
                <IcTwotoneClose />
              </button>
          )}
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={isDisabled}
            className={cx(
              isDisabled
                ? 'text-gray-300/80 border-gray-200 hover:cursor-not-allowed'
                : 'text-gray-700 border-gray-300 hover:border-primary-100',
              'relative inline-flex justify-between items-center p-3 w-full bg-white rounded-md border shadow-sm hover:text-primary-100',
            )}
          >
            <span
              className={cx(
                isDisabled ? 'text-gray-300/80' : 'hover:text-primary-100',
                'absolute -top-2 left-3 px-1 text-xs text-center z-10 bg-white/95 rounded',
              )}
            >
              {title}
            </span>
            <p
              className={cx(
                isDisabled
                  ? 'text-gray-300/80 cursor-not-allowed '
                  : 'text-gray-700 cursor-default',
                'font-normal font-NotoSansTC',
              )}
            >
              {selectedOption}
            </p>
            <div className="flex items-center">
              <MsArrowDropDown
                className={cx(
                  isDisabled ? 'text-gray-300/80' : 'hover:text-primary-300',
                  'ml-1 -mr-2 w-7 h-7 ',
                )}
              />
            </div>
          </button>
        </div>

        {isOpen && (
          <div className="overflow-y-auto absolute right-0 z-30 mt-0.5 w-full max-h-64 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right">
            <div
              className="p-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options?.map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={cx(
                    option === selectedOption ? 'bg-secondary-100/40' : '',
                    'block py-2 px-4 text-gray-700 cursor-pointer hover:text-gray-100 hover:bg-primary-300 active:bg-secondary-300 rounded',
                  )}
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
