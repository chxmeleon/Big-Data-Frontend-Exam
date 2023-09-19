import { Outlet } from 'react-router-dom';
import Header from './Header';

function DefaultLayout() {
  return (
    <main className="w-full h-screen">
      <Header />
      <div className="flex justify-start w-full">
        <div className="relative w-[146px]">
          {/* <div className="absolute rotate-90 left-0 top-0 origin-[0, 0] tracking-[18%] liner-gradient font-bold text-[200px] font-Ubuntu"> */}
          {/*   TAIWAN */}
          {/* </div> */}
          <div className="fixed top-14 left-0 w-full z-[-1]">
            <img src="brand.png" alt="" />
          </div>
        </div>
        <div className="w-full h-full pt-2">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default DefaultLayout;
