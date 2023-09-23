import { Link } from 'react-router-dom';
import { GearOption } from '../components/Icons';

function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full h-12">
      <div className="flex items-center justify-between px-[16px] py-[10px] bg-[#651FFF] text-white header-shadow">
        <Link to="/" reloadDocument className="font-bold font-Ubuntu">
          LOGO
        </Link>
        <button
          type="button"
          disabled
          className="flex justify-center items-center w-8 h-8 border hover:cursor-not-allowed rounded-[8px] border-white/30"
        >
          <GearOption className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default Header;
