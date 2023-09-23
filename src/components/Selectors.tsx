import { clsx as cx } from 'clsx';
import Selector from './Selector';
import Spinner from './Spinner';
import { optionsData } from '../libs/data';

export interface SelectorsProps {
  isButtonDisabled: boolean;
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
  isButtonDisabled,
  message,
  year,
  setYear,
  city,
  setCity,
  district,
  setDistrict,
  handleClick,
}: SelectorsProps) {
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
          isDisabled={
            city === '請選擇 縣/市' || city === '' || city === undefined
          }
          selectedCity={city}
          isRelative
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
    </>
  );
}

export default Selectors;
