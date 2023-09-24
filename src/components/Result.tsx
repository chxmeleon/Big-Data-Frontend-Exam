import React, { useEffect, useRef } from 'react';
import { clsx as cx } from 'clsx';
import * as Highcharts from 'highcharts';
import Chart from './Chart';
import Spinner from './Spinner';

export interface ResultProps {
  isProcessing: boolean;
  isNoData: boolean;
  isShowChart: boolean;
  resultTitle: string;
  columnOptions: Highcharts.Options;
  pieOptions: Highcharts.Options;
  scrollTargetRef: React.MutableRefObject<HTMLDivElement | null>;
}

function Result({
  isProcessing,
  isNoData,
  isShowChart,
  resultTitle,
  columnOptions,
  pieOptions,
  scrollTargetRef,
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
      <div className="relative w-full h-full" ref={scrollTargetRef}>
        {isProcessing ? (
          <div className="pt-20 w-full md:pb-96 md:h-full h-[550px] md:pt-[12.6rem]">
            <div className="flex flex-col items-center">
              <Spinner size="lg" />
              <h1 className="py-10 text-3xl">載入中...</h1>
            </div>
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
              {resultTitle}
            </h2>
            <Chart key="columnChart" options={columnOptions} />
            <Chart key="pieChart" options={pieOptions} />
          </div>
        ) : (
          <div className="h-[700px]" />
        )}
      </div>
    </>
  );
}

export default Result;
