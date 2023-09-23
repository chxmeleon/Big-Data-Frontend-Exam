import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { clsx as cx } from 'clsx';
import Selector from '../components/Selector';
import Chart from '../components/Chart';
import Spinner from '../components/Spinner';
import { optionsData } from '../libs/data';
import useDebounced from '../hooks/useDebounced';
import {
  calcPercentFromTwoValue,
  changeString,
  generateColumnChartOptions,
  generatePieChartOptions,
  sumProperties,
} from '../utils';

interface ApiResponse {
  responseData: Record<string, number>[];
  responseMessage: string;
}

const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());

function Search() {
  const {
    year: paramYear,
    city: paramCity,
    district: paramDistrict,
  } = useParams();

  const [year, setYear] = useState<string | undefined>(paramYear || '111');
  const [city, setCity] = useState<string | undefined>(
    paramCity || '請選擇 縣/市',
  );
  const [district, setDistrict] = useState<string | undefined>(
    paramDistrict || '請先選擇 縣/市',
  );

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${year}/${city}/${district}`);
  };

  const endpoint = import.meta.env.VITE_API_ENDPOINT;
  const requestApiPath = useMemo(
    () => `${endpoint}/${paramYear}?COUNTY=${changeString(
      paramCity,
    )}&TOWN=${changeString(paramDistrict)}`,
    [endpoint, paramYear, paramCity, paramDistrict],
  );

  const { data: searchData, isLoading } = useSWR<ApiResponse>(
    requestApiPath,
    fetcher,
  );

  const checkResponseApiPath = useMemo(
    () => `${endpoint}/${year}?COUNTY=${changeString(city)}&TOWN=${changeString(
      district,
    )}`,
    [endpoint, year, city, district],
  );

  const { data: checkState } = useSWR<ApiResponse>(
    checkResponseApiPath,
    fetcher,
  );

  const checkMessage = checkState?.responseMessage;
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const isLoadingData = useDebounced(isLoading, 1200);

  useEffect(() => {
    if (
      checkMessage !== '處理完成'
      || district === undefined
      || district === ''
      || city === ''
    ) {
      setIsButtonDisabled(true);
    } else {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 450);
    }
  }, [checkMessage, district, city]);

  const allData = searchData?.responseData;
  const message = searchData?.responseMessage;
  const finalData = sumProperties(allData || [], [
    'household_ordinary_total',
    'household_single_total',
    'household_single_m',
    'household_single_f',
    'household_ordinary_m',
    'household_ordinary_f',
  ]);
  const singleTotalPercent = calcPercentFromTwoValue(
    finalData.householdSingleTotal,
    finalData.householdOrdinaryTotal,
  );
  const ordinaryTotalPercent = calcPercentFromTwoValue(
    finalData.householdOrdinaryTotal,
    finalData.householdSingleTotal,
  );
  const columnOptions = generateColumnChartOptions(finalData);
  const pieOptions = generatePieChartOptions(
    singleTotalPercent,
    ordinaryTotalPercent,
  );

  return (
    <div className="px-2 w-full h-full md:px-6 lg:px-48  bg-white/80">
      {isLoadingData && paramYear !== undefined ? (
        <div className="flex justify-center items-center w-full h-[95vh]">
          <div className="flex flex-col justify-center items-center">
            <Spinner size="lg" />
            <h1 className="py-10 text-3xl">載入中...</h1>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <h1 className="py-4 mb-5 text-2xl font-normal text-center font-NotoSansTC md:text-[32px]">
            人口數、戶數按戶別及性別統計
          </h1>
          <div className="flex flex-col gap-4 py-2 mb-4 w-full md:flex-row md:justify-center md:items-center md:h-12">
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
          <div className="inline-flex relative justify-between items-center pt-9 w-full">
            <hr className="flex-grow border-0 h-[1px] bg-secondary-300" />
            <div className="w-24 py-2 px-3 font-medium text-center rounded-full border text-[13px] mx-[10px] border-secondary-300 text-secondary-300">
              搜尋結果
            </div>
            <hr className="flex-grow border-0 h-[1px] bg-secondary-300" />
          </div>
          {message === '處理完成' ? (
            <div className="py-10 w-full md:py-16">
              <h2 className="font-normal text-center font-NotoSansTC text-[32px]">
                {paramYear}
                年
                {paramCity}
                {' '}
                {paramDistrict}
              </h2>
              <Chart options={columnOptions} />
              <Chart options={pieOptions} />
            </div>
          ) : message === '查無資料' && paramYear !== undefined ? (
            <div className="py-10 w-full md:py-16">
              <h2 className="font-normal text-center font-NotoSansTC text-[32px]">
                查無資料
              </h2>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Search;
