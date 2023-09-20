import { Outlet } from 'react-router-dom';
import Header from './Header';

function DefaultLayout() {
  return (
    <main className="w-full h-screen">
      <Header />
      <div className="pt-12 flex justify-start w-full">
        <div className="relative w-[146px]">
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
