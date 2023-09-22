import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Selectors from '../components/Selectors';
import Chart from '../components/Chart';
import Spinner from '../components/Spinner';

const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());

const changeString = (str: string | undefined): string | undefined => (str?.includes('台') ? str.replace('台', '臺') : str);

const snakeToCamel = (str: string): string => str.replace(/(_\w)/g, (k) => k[1].toUpperCase());

const sumProperties = (
  objects: Record<string, number>[],
  propertiesToSum: string[],
): Record<string, number> => {
  const totalSum: Record<string, number> = {};
  propertiesToSum.forEach((prop) => {
    totalSum[snakeToCamel(prop)] = objects
      ?.map((obj) => Number(obj[prop]))
      ?.reduce((acc, val) => acc + val, 0);
  });

  return totalSum;
};

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

  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  const apiPath = `${endpoint}/${paramYear}?COUNTY=${changeString(
    paramCountry,
  )}&TOWN=${changeString(paramDistrict)}`;

  const { data: searchData, isLoading } = useSWR(apiPath, fetcher);

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

  const finalData = sumProperties(allData, selectProperties);
  console.log(finalData);

  const navigate = useNavigate();
  const hanleClick = () => {
    navigate(`/${year}/${country}/${district}`, {
      state: `/${year}/${country}/${district}`,
    });
  };

  const columnOptions: Highcharts.Options = {
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    chart: {
      height: 650,
      backgroundColor: 'transparent',
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
        data: [finalData.householdSingleM, finalData.householdOrdinaryM],
        color: '#7960AD',
      },
      {
        name: '女',
        type: 'column',
        data: [finalData.householdSingleF, finalData.householdOrdinaryF],
        color: '#AD8AF8',
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: 400,
            },
          },
        },
      ],
    },
  };

  const singleTotalPercent = finalData.householdSingleTotal
    / (finalData.householdSingleTotal + finalData.householdOrdinaryTotal);
  const ordinaryTotalPercent = finalData.householdOrdinaryTotal
    / (finalData.householdSingleTotal + finalData.householdOrdinaryTotal);

  const peiOptions: Highcharts.Options = {
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    chart: {
      height: 650,
      backgroundColor: 'transparent',
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
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: 400,
            },
          },
        },
      ],
    },
  };

  return (
    <div className="px-2 w-full h-full md:px-48 md:bg-transparent bg-white/80">
      <h1 className="py-4 mb-5 font-normal text-center text-[32px] font-NotoSansTC">
        人口數、戶數按戶別及性別統計
      </h1>
      <Selectors />
      <div className="inline-flex justify-center items-center pt-9 w-full">
        <hr className="w-full border-0 h-[1px] bg-secondary-300" />
        <span className="absolute left-[37.6%] md:left-[46.6%] bg-white w-[98px]">
          <div className="py-2 px-3 font-medium text-center rounded-full border text-[13px] mx-[10px] border-secondary-300 text-secondary-300">
            搜尋結果
          </div>
        </span>
      </div>

      {message === '處理完成' ? (
        <div className="py-10 w-full md:py-16">
          <h2 className="font-normal text-center font-NotoSansTC text-[32px]">
            {paramYear}
            年
            {paramCountry}
            {' '}
            {paramDistrict}
          </h2>
          <Chart options={columnOptions} />
          <Chart options={peiOptions} />
        </div>
      ) : isLoading ? (
        <Spinner size="md" />
      ) : null}
    </div>
  );
}

export default Search;
