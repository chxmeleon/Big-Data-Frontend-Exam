import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import Selectors, { SelectorsProps } from '../components/Selectors';
import Spinner from '../components/Spinner';
import useDebounced from '../hooks/useDebounced';
import {
  calcPercentFromTwoValue,
  changeString,
  generateColumnChartOptions,
  generatePieChartOptions,
  sumProperties,
} from '../utils';
import Result, { ResultProps } from '../components/Result';
import checkInitailValue from '../utils/checkInitialValue';
import { optionsData } from '../libs/data';

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

  const navigate = useNavigate();
  const [year, setYear] = useState<string | undefined>(
    checkInitailValue(paramYear, 'year'),
  );
  const [city, setCity] = useState<string | undefined>(
    checkInitailValue(paramCity, 'city'),
  );
  const [district, setDistrict] = useState<string | undefined>(
    checkInitailValue(paramDistrict, 'district'),
  );

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

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const handleClick = () => {
    navigate(`/${year}/${city}/${district}`);
    setIsSubmit(true);
    setTimeout(() => {
      setIsSubmit(false);
    }, 1000);

    setIsScrolling(true);
  };

  const message = searchData?.responseMessage;
  const finalData = sumProperties(searchData?.responseData || [], [
    'household_ordinary_total',
    'household_single_total',
    'household_single_m',
    'household_single_f',
    'household_ordinary_m',
    'household_ordinary_f',
  ]);

  const cityDistrictArray = [
    ...optionsData.cities,
    ...Object.values(optionsData.districts).flat(),
  ];

  const isBtnDisabled = !cityDistrictArray.includes(city as string)
    || !cityDistrictArray.includes(district as string);

  const selectorsProps: SelectorsProps = {
    isButtonDisabled: isBtnDisabled,
    message,
    year,
    setYear,
    city,
    setCity,
    district,
    setDistrict,
    handleClick,
  };

  const resutlProps: ResultProps = {
    isScrolling,
    setIsScrolling,
    title: `${paramYear}年 ${paramCity} ${paramDistrict}`,
    isProcessing: message === '處理完成' && paramYear !== undefined && isSubmit,
    isNoData: message === '查無資料' && paramYear !== undefined,
    isShowChart: message === '處理完成' && paramYear !== undefined,
    columnOptions: generateColumnChartOptions(finalData),
    pieOptions: generatePieChartOptions(
      calcPercentFromTwoValue(
        finalData.householdSingleTotal,
        finalData.householdOrdinaryTotal,
      ),
      calcPercentFromTwoValue(
        finalData.householdOrdinaryTotal,
        finalData.householdSingleTotal,
      ),
    ),
  };

  return (
    <div className="px-2 w-full h-full md:px-6 lg:px-48">
      {useDebounced(isLoading, 1200) && paramYear !== undefined ? (
        <div className="flex justify-center items-center w-full h-[95vh]">
          <div className="flex flex-col justify-center items-center">
            <Spinner size="lg" />
            <h1 className="py-10 text-3xl">載入中...</h1>
          </div>
        </div>
      ) : (
        <div className="relative py-4 w-full">
          <Selectors {...selectorsProps} />
          <Result {...resutlProps} />
        </div>
      )}
    </div>
  );
}

export default Search;
