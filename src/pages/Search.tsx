import { clsx as cx } from 'clsx';

function Search() {
  const selectSytle = cx(
    'border-2 py-1.5 px-2 text-[#333333] text-sm font-NotoSansTC font-normal'
  );

  return (
    <div className="px-48 w-full h-full min-h-fit">
      <h1 className="py-4 mb-5 font-normal text-center text-[32px] font-NotoSansTC">
        人口數、戶數按戶別及性別統計
      </h1>
      <div className="flex gap-4 justify-center items-center py-2 mb-4 w-full h-12">
        <select className={selectSytle} id="years">
          <option className="" value="111">
            111
          </option>
        </select>
        <select className={selectSytle} name="countries" id="countries">
          <option value="" disabled selected>
            請選擇 縣/市
          </option>
          <option value="volvo">Volvo</option>
        </select>
        <select className={selectSytle} name="districts" id="districts">
          <option value="" disabled selected>
            請先選擇 縣/市
          </option>
          <option value="volvo">Volvo</option>
        </select>

        <button
          type="submit"
          className="py-2.5 px-4 font-bold rounded bg-black/10 text-black/25 font-Ubuntu"
        >
          SUBMIT
        </button>
      </div>
      <div className="inline-flex justify-center items-center pt-9 w-full">
        <hr className="w-full h-[1px] bg-[#C29FFF] border-0" />
        <span className="absolute left-1/2 bg-white w-[98px]">
          <div className="text-[13px] font-medium mx-[10px] px-3 py-2 border rounded-full border-[#C29FFF] text-[#C29FFF] text-center">
            搜尋結果
          </div>
        </span>
      </div>
    </div>
  );
}

export default Search;
