import { optionsData } from '../libs/data';

const checkInitailValue = (value: string | undefined, key: string) => {
  const optionsFlattenArray = [
    ...optionsData.years,
    ...optionsData.cities,
    ...Object.values(optionsData.districts).flat(),
  ];

  const initailValue: Record<string, string> = {
    year: '111',
    city: '請選擇 縣/市',
    district: '請先選擇 縣/市',
  };

  if (!optionsFlattenArray.includes(value || '')) {
    return initailValue[key];
  }
  return value;
};

export default checkInitailValue;
