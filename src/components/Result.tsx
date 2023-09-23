import React from 'react';
import * as Highcharts from 'highcharts';
import Chart from './Chart';
import Spinner from './Spinner';

export interface ResultProps {
  isProcessing: boolean;
  isNoData: boolean;
  isShowChart: boolean;
  title: string;
  columnOptions: Highcharts.Options;
  pieOptions: Highcharts.Options;
}

function Result({
  isProcessing,
  isNoData,
  isShowChart,
  title,
  columnOptions,
  pieOptions,
}: ResultProps) {
  return (
    <>
      <div className="inline-flex relative justify-between items-center pt-9 w-full">
        <hr className="flex-grow border-0 h-[1px] bg-secondary-300" />
        <div className="py-2 px-3 w-24 font-medium text-center rounded-full border text-[13px] mx-[10px] border-secondary-300 text-secondary-300">
          <p>搜尋結果</p>
        </div>
        <hr className="flex-grow border-0 h-[1px] bg-secondary-300" />
      </div>
      {isProcessing ? (
        <div className="flex flex-col justify-center items-center pt-[12.6rem] pr-3 pb-52 md:pb-96">
          <Spinner size="lg" />
          <h1 className="py-10 text-3xl">載入中...</h1>
        </div>
      ) : isNoData ? (
        <div className="py-10 w-full md:py-16">
          <h2 className="font-normal text-center font-NotoSansTC text-[32px]">
            查無資料
          </h2>
        </div>
      ) : isShowChart ? (
        <div className="pt-8 w-full">
          <h2 className="font-normal text-center font-NotoSansTC text-[32px]">
            {title}
          </h2>
          <Chart options={columnOptions} />
          <Chart options={pieOptions} />
        </div>
      ) : null}
    </>
  );
}

export default Result;
