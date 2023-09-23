import * as Highcharts from 'highcharts';

export const changeString = (str: string | undefined): string | undefined => (str?.includes('台') ? str.replace('台', '臺') : str);

export const calcPercentFromTwoValue = (
  firstValue: number,
  secondValue: number,
) => Math.round((firstValue / secondValue) * 10000) / 100;

export const sumProperties = (
  objects: Record<string, number>[],
  propertiesToSum: string[],
): Record<string, number> => {
  const totalSum: Record<string, number> = {};
  const snakeToCamel = (str: string): string => str.replace(/(_\w)/g, (k) => k[1].toUpperCase());
  propertiesToSum.forEach((prop) => {
    totalSum[snakeToCamel(prop)] = objects
      ?.map((obj) => Number(obj[prop]))
      ?.reduce((acc, val) => acc + val, 0);
  });

  return totalSum;
};

export const generateColumnChartOptions = (
  data: Record<string, number>,
): Highcharts.Options => ({
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
    title: {
      text: '型態',
      textAlign: 'center',
      x: -20,
      y: -10,
      style: {
        fontSize: '20px',
      },
    },
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
      x: -50,
      style: {
        fontSize: '20px',
      },
    },
  },

  series: [
    {
      name: '男',
      type: 'column',
      data: [data.householdOrdinaryM, data.householdSingleM],
      color: '#7960AD',
    },
    {
      name: '女',
      type: 'column',
      data: [data.householdOrdinaryF, data.householdSingleF],
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
});

export const generatePieChartOptions = (
  singleTotalPercent: number,
  ordinaryTotalPercent: number,
): Highcharts.Options => ({
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
          y: ordinaryTotalPercent,
          color: '#656EAD',
        },
        {
          name: '獨立生活',
          y: singleTotalPercent,
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
});
