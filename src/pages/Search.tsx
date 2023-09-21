import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
  const { year, country, district } = useParams();
  const [yearParam, setYearParam] = useState<string | undefined>(year || '111');
  const [countryParam, setCountryParam] = useState<string | undefined>(
    country || '請選擇縣/市',
  );
  const [districtParam, setDistrictParam] = useState<string | undefined>(
    district || '請先選擇縣/市',
  );
  const [finalData, setFinalData] = useState<Record<string, number>>({});
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const changeString = (str: string | undefined): string | undefined => (str?.includes('台') ? str.replace('台', '臺') : str);

  const apiPath = `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/${yearParam}?COUNTY=${changeString(
    countryParam,
  )}&TOWN=${changeString(districtParam)}`;

  const { data: searchData, isLoading, mutate } = useSWR(apiPath, fetcher);
  const allData = searchData?.responseData;
  const message = searchData?.responseMessage;
  const selectProperties = [
    'household_ordinary_total',
    'household_single_total',
    'household_single_m',
    'household_single_f',
    'household_ordinary_m',
    'household_ordinary_f',
  ];

  const allProperties = Object.assign(
    sumProperties(allData, selectProperties),
    { title: `${yearParam}年 ${countryParam} ${districtParam}` },
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [oldLocation, setOldLocation] = useState<string>(location.key);

  const hanleClick = () => {
    setFinalData(allProperties);
    setIsSubmited(true);
    navigate(`/${yearParam}/${countryParam}/${districtParam}`, {
      state: `/${yearParam}/${countryParam}/${districtParam}`,
    });
  };

  /* useEffect(() => { */
  /*   if ( */
  /*     !isLoading */
  /*     && message !== '查無資料' */
  /*     && location.pathname !== '/' */
  /*     && location.state === `/${yearParam}/${countryParam}/${districtParam}` */
  /*   ) { */
  /*     setFinalData(allProperties); */
  /*   } */
  /**/
  /*   if (oldLocation !== location.key) { */
  /*     setOldLocation(location.key); */
  /*     window.location.reload(); */
  /*   } */
  /* }, [location, oldLocation, setFinalData, allProperties]); */

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const peiChartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const options: Highcharts.Options = {
    title: {
      text: '人口數統計',
    },
    series: [
      {
        type: 'bar',
        data: [1, 2, 3],
      },
    ],
  };

  const peiOptions: Highcharts.Options = {
    title: {
      text: '戶數統計',
    },
    series: [
      {
        type: 'pie',
        data: [1, 2, 3],
      },
    ],
  };

  return (
    <div className="px-48 w-full h-full min-h-fit">
      <h1 className="py-4 mb-5 font-normal text-center text-[32px] font-NotoSansTC">
        人口數、戶數按戶別及性別統計
      </h1>
      <Selector
        yearParam={yearParam}
        countryParam={countryParam}
        districtParam={districtParam}
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
      <div className="py-20 w-full">
        <h2 className="font-normal text-center font-NotoSansTC text-[32px]">
          {finalData.title}
        </h2>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />

        <HighchartsReact
          highcharts={Highcharts}
          options={peiOptions}
          ref={peiChartComponentRef}
        />
        <div>{finalData.household_ordinary_total}</div>
      </div>
    </div>
  );
}

export default Search;
