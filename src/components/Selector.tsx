import { clsx as cx } from 'clsx';
import { years, data } from '../libs/data';

type SelectorProps = {
  yearParam: string | undefined;
  countryParam: string | undefined;
  districtParam: string | undefined;
  setYearParam: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCountryParam: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDistrictParam: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleClick: () => void;
};

function Selector({
  yearParam,
  countryParam,
  districtParam,
  setYearParam,
  setCountryParam,
  setDistrictParam,
  handleClick,
}: SelectorProps) {
  const selectSytle = cx(
    'border-2 py-1.5 px-2 text-[#333333] text-sm font-NotoSansTC font-normal',
  );

  return (
    <div className="flex gap-4 justify-center items-center py-2 mb-4 w-full h-12">
      <select
        className={selectSytle}
        id="years"
        onChange={(e) => setYearParam(e.target.value)}
        defaultValue={yearParam}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        className={selectSytle}
        name="countries"
        id="countries"
        onChange={(e) => setCountryParam(e.target.value)}
        defaultValue={countryParam}
      >
        <option value="請選擇 縣/市" selected>
          請選擇 縣/市
        </option>
        {data.contries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      <select
        className={selectSytle}
        name="districts"
        id="districts"
        onChange={(e) => setDistrictParam(e.target.value)}
        disabled={countryParam?.charAt(0) === '請'}
        defaultValue={districtParam}
      >
        <option value="請先選擇 縣/市" selected>
          請先選擇 縣/市
        </option>
        {data.districts[countryParam as string]?.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className={cx(
          districtParam?.charAt(0) === '請'
            ? 'bg-black/10 text-black/25'
            : 'bg-primary-100 text-white',
          'py-2.5 px-4 font-bold rounded  font-Ubuntu',
        )}
        onClick={handleClick}
        disabled={districtParam?.charAt(0) === '請'}
      >
        SUBMIT
      </button>
    </div>
  );
}

export default Selector;
