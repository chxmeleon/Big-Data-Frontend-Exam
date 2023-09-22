import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import * as Highcharts from 'highcharts';
import { clsx as cx } from 'clsx';
import Selector from '../components/Selector';
import Chart from '../components/Chart';
import Spinner from '../components/Spinner';
import { optionsData } from '../libs/data';
import useDebounced from '../hooks/useDebounced';

const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());

const changeString = (str: string | undefined): string | undefined =>
  str?.includes('台') ? str.replace('台', '臺') : str;

const snakeToCamel = (str: string): string =>
  str.replace(/(_\w)/g, (k) => k[1].toUpperCase());

const sumProperties = (
  objects: Record<string, number>[],
  propertiesToSum: string[]
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
    city: paramCity,
    district: paramDistrict,
  } = useParams();

  const [year, setYear] = useState<string | undefined>(paramYear || '111');
  const [city, setCity] = useState<string | undefined>(
    paramCity || '請選擇縣/市'
  );
  const [district, setDistrict] = useState<string | undefined>(
    paramDistrict || '請先選擇縣/市'
  );

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${year}/${city}/${district}`);
  };

  const endpoint = import.meta.env.VITE_API_ENDPOINT;
  const requestApiPath = useMemo(() => {
    return `${endpoint}/${paramYear}?COUNTY=${changeString(
      paramCity
    )}&TOWN=${changeString(paramDistrict)}`;
  }, [endpoint, paramYear, paramCity, paramDistrict]);

  const checkResponseApiPath = useMemo(() => {
    return `${endpoint}/${year}?COUNTY=${changeString(
      city
    )}&TOWN=${changeString(district)}`;
  }, [endpoint, year, city, district]);

  const {
    data: searchData,
    isLoading,
    error,
  } = useSWR(requestApiPath, fetcher);
  const { data: checkState } = useSWR(checkResponseApiPath, fetcher);
  const checkMessage = checkState?.responseMessage;
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const isLoadingData = useDebounced(isLoading, 1400);

  useEffect(() => {
    if (
      checkMessage !== '處理完成' ||
      district === undefined ||
      district === '' ||
      city === ''
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
  const selectProperties = [
    'household_ordinary_total',
    'household_single_total',
    'household_single_m',
    'household_single_f',
    'household_ordinary_m',
    'household_ordinary_f',
  ];
  const finalData = sumProperties(allData, selectProperties);

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
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td><b>{point.y:,.f}</b></td></tr>',
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

  const singleTotalPercent =
    finalData.householdSingleTotal /
    (finalData.householdSingleTotal + finalData.householdOrdinaryTotal);
  const ordinaryTotalPercent =
    finalData.householdOrdinaryTotal /
    (finalData.householdSingleTotal + finalData.householdOrdinaryTotal);

  const pieOptions: Highcharts.Options = {
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
      {isLoadingData && paramYear !== undefined ? (
        <div className="flex justify-center items-center w-full h-[95vh]">
          <div className="flex flex-col justify-center items-center">
            <Spinner size="lg" />
            <h1 className="py-10 text-3xl">載入中...</h1>
          </div>
        </div>
      ) : (
        <>
          <h1 className="py-4 mb-5 font-normal text-center text-[32px] font-NotoSansTC">
            人口數、戶數按戶別及性別統計
          </h1>
          <div className="flex gap-4 py-2 mb-4 w-full md:justify-center md:items-center md:h-12">
            <Selector
              size="small"
              options={optionsData.years}
              initialValue={year}
              onSelect={setYear}
              title="年份"
              isDisabled={false}
            />
            <Selector
              size="large"
              options={optionsData.cities}
              initialValue={city}
              onSelect={setCity}
              title="縣/市"
              isDisabled={false}
            />
            <Selector
              size="large"
              options={optionsData.districts[city as string]}
              initialValue={district}
              onSelect={setDistrict}
              title="區"
              isDisabled={city === '請選擇縣/市'}
            />
            <button
              type="submit"
              className={cx(
                isButtonDisabled
                  ? 'bg-black/10 text-black/25'
                  : 'bg-primary-100 text-white',
                'w-24 h-12 py-2.5 font-bold rounded inline-flex justify-center items-center font-Ubuntu'
              )}
              onClick={handleClick}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled && district !== '請先選擇縣/市' ? (
                <div className="relative">
                  <span className="absolute inset-0 -translate-x-5">
                    SUBMIT
                  </span>
                  <Spinner size="xs" />
                </div>
              ) : (
                <span>SUBMIT</span>
              )}
            </button>
          </div>
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
                {paramYear}年{paramCity} {paramDistrict}
              </h2>
              <Chart options={columnOptions} />
              <Chart options={pieOptions} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Search;
