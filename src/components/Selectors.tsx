import { clsx as cx } from 'clsx';
import { useEffect, useState } from 'react';
import Selector from './Selector';
import Spinner from './Spinner';
import { optionsData } from '../libs/data';
import useDebounced from '../hooks/useDebounced';

export interface SelectorsProps {
  message: string | undefined;
  year: string | undefined;
  setYear: React.Dispatch<React.SetStateAction<string | undefined>>;
  city: string | undefined;
  setCity: React.Dispatch<React.SetStateAction<string | undefined>>;
  district: string | undefined;
  setDistrict: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleClick: () => void;
}

function Selectors({
  message,
  year,
  setYear,
  city,
  setCity,
  district,
  setDistrict,
  handleClick,
}: SelectorsProps) {
  const [hasAutoDistrict, setHasAutoDistrict] = useState<boolean>(true);
  const onToggleAutoDistrict = () => {
    setHasAutoDistrict((prev) => !prev);
  };

  const isButtonDisabled = district === undefined
    || district === ''
    || city === ''
    || year === undefined;

  return (
    <>
      <h1 className="pb-14 text-2xl font-normal text-center font-NotoSansTC md:text-[32px]">
        人口數、戶數按戶別及性別統計
      </h1>
      <div className="flex flex-col gap-4 mb-4 w-full md:flex-row md:justify-center md:items-center md:h-12">
        <Selector
          size="small"
          options={optionsData.years}
          initialValue={year}
          onSelect={setYear}
          title="年份"
        />
        <Selector
          size="large"
          options={optionsData.cities}
          initialValue={city}
          onSelect={setCity}
          title="縣/市"
        />
        <Selector
          size="large"
          options={optionsData.districts[city as string]}
          initialValue={district}
          onSelect={setDistrict}
          title="區"
          isDisabled={useDebounced(!optionsData.cities.includes(city || ''), 5)}
          selectedCity={city}
          isRelative
          isAutoDistrict={hasAutoDistrict}
        />
        <button
          type="submit"
          className={cx(
            isButtonDisabled
              ? 'bg-neutral-200 text-black/25 cursor-not-allowed'
              : 'bg-primary-100 text-white',
            ' w-full md:w-24 h-12 py-2.5 font-bold rounded inline-flex justify-center items-center font-Ubuntu',
          )}
          onClick={handleClick}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled && district !== '請先選擇 縣/市' ? (
            <div className="relative">
              <span className="text-center">SUBMIT</span>
              {message !== '查無資料' && (
                <div className="absolute inset-0">
                  <Spinner size="xs" />
                </div>
              )}
            </div>
          ) : (
            <span>SUBMIT</span>
          )}
        </button>
      </div>
      <div className="flex justify-end pr-1 md:justify-center md:pl-[11.66rem]">
        <div className="inline-flex gap-3 justify-between items-center">
          <button
            type="button"
            onClick={onToggleAutoDistrict}
            aria-label="switch-auto-district"
            className={cx(
              hasAutoDistrict
                ? 'bg-secondary-100 border-primary-100'
                : 'bg-tertiary-300/50 border-primary-100',
              'p-2 rounded border',
            )}
          />
          <p className="text-xs text-gray-700">區 選項自動選取</p>
        </div>
      </div>
    </>
  );
}

export default Selectors;
