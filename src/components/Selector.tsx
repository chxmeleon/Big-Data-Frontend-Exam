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
};

function Selector({
  options,
  initialValue,
  onSelect,
  size,
  title,
  isDisabled = false,
  isRelative = false,
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
  const [oldSelectedCity, setOldSelectedCity] = useState<string | undefined>(
    selectedCity,
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

  useEffect(() => {
    if (isRelative) {
      setOldSelectedCity(selectedCity);
    }

    if (oldSelectedCity !== selectedCity && isRelative) {
      if (selectedCity === '') {
        setSelectedOption('請先選擇 縣/市');
        onSelect('');
      } else {
        setTimeout(() => {
          setSelectedOption(options[0]);
          onSelect(options[0]);
        }, 100);
      }
    }
  }, [selectedCity, isRelative, oldSelectedCity, onSelect, options]);

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
                  'absolute right-10 top-[36%] z-[1]',
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
                'absolute -top-1.5 left-3 px-1 text-xs text-center z-10 bg-white',
              )}
            >
              {title}
            </span>
            <p
              className={cx(
                isDisabled
                  ? 'cursor-not-allowed text-gray-300/80'
                  : 'text-gray-700 cursor-default',
                'font-normal   font-NotoSansTC',
              )}
            >
              {selectedOption}
            </p>
            <div className="flex items-center">
              <MsArrowDropDown
                className={cx(
                  isDisabled ? '' : 'hover:text-primary-300',
                  'ml-1 -mr-2 w-7 h-7 ',
                )}
              />
            </div>
          </button>
        </div>

        {isOpen && (
          <div className="overflow-y-auto absolute right-0 z-30 mt-0.5 w-full max-h-64 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options?.map((option) => (
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
