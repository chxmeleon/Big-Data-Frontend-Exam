import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import useSWR from 'swr';
import { clsx as cx } from 'clsx';
import { optionsData } from '../libs/data';
import Selector from './Selector';

const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());
const changeString = (str: string | undefined): string | undefined => (str?.includes('台') ? str.replace('台', '臺') : str);

function Selectors() {
  const {
    year: paramYear,
    country: paramCountry,
    district: paramDistrict,
  } = useParams();

  const [year, setYear] = useState<string | undefined>(paramYear || '111');
  const [country, setCountry] = useState<string | undefined>(
    paramCountry || '請選擇縣/市',
  );
  const [district, setDistrict] = useState<string | undefined>(
    paramDistrict || '請先選擇縣/市',
  );

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${year}/${country}/${district}`);
  };

  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  const apiPath = `${endpoint}/${year}?COUNTY=${changeString(
    country,
  )}&TOWN=${changeString(district)}`;

  const { data: searchData, isLoading } = useSWR(apiPath, fetcher);
  const message = searchData?.responseMessage;
  console.log(message);

  return (
    <div className="flex gap-4 py-2 mb-4 w-full md:justify-center md:items-center md:h-12">
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
        initialValue={country}
        onSelect={setCountry}
        title="縣/市"
      />
      <Selector
        size="large"
        options={optionsData.districts[country as string]}
        initialValue={district}
        onSelect={setDistrict}
        title="區"
      />
      <button
        type="submit"
        className={cx(
          message === '查無資料'
            ? 'bg-black/10 text-black/25'
            : 'bg-primary-100 text-white',
          'py-2.5 px-4 font-bold rounded  font-Ubuntu',
        )}
        onClick={handleClick}
        disabled={message === '查無資料'}
      >
        SUBMIT
      </button>
    </div>
  );
}

export default Selectors;
