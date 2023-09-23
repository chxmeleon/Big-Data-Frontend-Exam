import { Outlet, useLocation } from 'react-router-dom';
import { clsx as cx } from 'clsx';
import Header from './Header';

function DefaultLayout() {
  const location = useLocation();
  return (
    <main className="relative w-full h-full">
      <Header />
      <div className="w-full lg:flex">
        <div className="relative w-[146px]">
          <div className="fixed font-bold z-[-1] left-0 top-0 rotate-90 -translate-x-4 -translate-y-[61%] tracking-[3.2rem] liner-gradient text-[200px] font-Ubuntu">
            TAIWAN
          </div>
        </div>
        <div className="flex relative justify-center pt-2 w-full h-full">
          <div
            className={cx(
              location.pathname === '/'
                ? ' h-[calc(100vh-3.25rem)] sm:h-[calc(100vh-3.8rem)] md:h-[calc(100vh-4.7rem)]'
                : 'h-full',
              'w-full',
            )}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}

export default DefaultLayout;
