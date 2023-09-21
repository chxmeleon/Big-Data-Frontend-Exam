import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Selector from '../components/Selector';

const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());

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
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const changeString = (str: string | undefined): string | undefined => (str?.includes('台') ? str.replace('台', '臺') : str);

  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  const apiPath = `${endpoint}/${year}?COUNTY=${changeString(
    country,
  )}&TOWN=${changeString(district)}`;

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
    { title: `${year}年 ${country} ${district}` },
  );

  const [finalData, setFinalData] = useState<Record<string, number>>({});

  const location = useLocation();
  const navigate = useNavigate();
  const hanleClick = () => {
    setFinalData(allProperties);
    setIsSubmited(true);
    navigate(`/${year}/${country}/${district}`, {
      state: `/${year}/${country}/${district}`,
    });
  };

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const peiChartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const options: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      height: 650,
    },
    title: {
      text: '人口數統計',
      style: {
        fontSize: '32px',
        fontFamily: 'Noto Sans TC',
        fontWeight: '400',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
        + '<td><b>{point.y:,.f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    xAxis: {
      categories: ['共同生活', '獨立生活'],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: '數量',
        align: 'high',
        textAlign: 'left',
        rotation: 0,
        offset: 0,
        margin: 0,
        y: -24,
        x: -37,
      },
    },
    series: [
      {
        name: '男',
        type: 'column',
        data: [finalData.household_single_m, finalData.household_ordinary_m],
        color: '#7960AD',
      },
      {
        name: '女',
        type: 'column',
        data: [finalData.household_single_f, finalData.household_ordinary_f],
        color: '#AD8AF8',
      },
    ],
  };

  const singleTotalPercent = finalData.household_single_total
    / (finalData.household_single_total + finalData.household_ordinary_total);
  const ordinaryTotalPercent = finalData.household_ordinary_total
    / (finalData.household_single_total + finalData.household_ordinary_total);

  const peiOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      height: 650,
    },
    title: {
      text: '戶數統計',
      style: {
        fontSize: '32px',
        fontFamily: 'Noto Sans TC',
        fontWeight: '400',
      },
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
        },
        showInLegend: true,
      },
    },
    series: [
      {
        type: 'pie',
        data: [
          {
            name: '共同生活',
            y: Math.round(singleTotalPercent * 10000) / 100,
            color: '#656EAD',
          },
          {
            name: '獨立生活',
            y: Math.round(ordinaryTotalPercent * 10000) / 100,
            color: '#A5B1F9',
          },
        ],
      },
    ],
  };

  return (
    <div className="px-48 w-full h-full">
      <h1 className="py-4 mb-5 font-normal text-center text-[32px] font-NotoSansTC">
        人口數、戶數按戶別及性別統計
      </h1>
      <Selector
        yearParam={year}
        countryParam={country}
        districtParam={district}
        setYearParam={setYear}
        setCountryParam={setCountry}
        setDistrictParam={setDistrict}
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

      {location.pathname !== '/' ? (
        <div className="py-16 w-full">
          <h2 className="font-normal text-center font-NotoSansTC text-[32px]">
            {finalData.title}
          </h2>
          <div className="pt-20">
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              ref={chartComponentRef}
            />
          </div>
          <div className="pt-20">
            <HighchartsReact
              highcharts={Highcharts}
              options={peiOptions}
              ref={peiChartComponentRef}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Search;
