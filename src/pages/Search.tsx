import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import Selector from '../components/Selector';

const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());

interface AllDataProps {
  key: string;
}

interface ResultProps {
  key: number;
}

function sumProperties(
  objects: Record<string, number>[],
  propertiesToSum: string[],
): Record<string, number> {
  const totalSum: Record<string, number> = {};
  propertiesToSum.forEach((prop) => {
    totalSum[prop] = objects
      ?.map((obj) => Number(obj[prop]))
      ?.reduce((acc, val) => acc + val, 0);
  });

  return totalSum;
}

function Search() {
  const [yearParam, setYearParam] = useState<string>('111');
  const [countryParam, setCountryParam] = useState<string>('');
  const [districtParam, setDistrictParam] = useState<string>('');
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const changeString = (str: string): string => (str.includes('台') ? str.replace('台', '臺') : str);

  const apiPath = `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/${yearParam}?COUNTY=${changeString(
    countryParam,
  )}&TOWN=${changeString(districtParam)}`;

  const { data: searchData, mutate } = useSWR(
    isSubmited ? apiPath : null,
    fetcher,
  );
  const allData: AllDataProps[] = searchData?.responseData;
  const selectProperties = [
    'household_ordinary_total',
    'household_single_total',
    'household_single_m',
    'household_single_f',
    'household_ordinary_m',
    'household_ordinary_f',
  ];

  const navigate = useNavigate();
  const hanleClick = () => {
    setIsSubmited(true);
    navigate(`/${yearParam}/${countryParam}/${districtParam}`);
    mutate();
  };

  /* const calculateData = sumProperties(allData, selectProperties); */

  return (
    <div className="px-48 w-full h-full min-h-fit">
      <h1 className="py-4 mb-5 font-normal text-center text-[32px] font-NotoSansTC">
        人口數、戶數按戶別及性別統計
      </h1>
      <Selector
        yearParam={yearParam}
        countryParam={countryParam}
        setYearParam={setYearParam}
        setCountryParam={setCountryParam}
        setDistrictParam={setDistrictParam}
        handleClick={hanleClick}
      />
      <div className="inline-flex justify-center items-center pt-9 w-full">
        <hr className="w-full h-[1px] bg-[#C29FFF] border-0" />
        <span className="absolute left-1/2 bg-white w-[98px]">
          <div className="text-[13px] font-medium mx-[10px] px-3 py-2 border rounded-full border-[#C29FFF] text-[#C29FFF] text-center">
            搜尋結果
          </div>
        </span>
      </div>
    </div>
  );
}

export default Search;
