import { useEffect, useState } from 'react';

const useScreenSize = () => {
  const getCurrentDimension = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [screenSize, setScreenSize] = useState<Record<string, number>>(
    getCurrentDimension(),
  );

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isLaptop = screenSize.width >= 1024 && screenSize.width < 1440;

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener('resize', updateDimension);

    return () => {
      window.removeEventListener('resize', updateDimension);
    };
  }, [screenSize]);
  return {
    isMobile, isTablet, isLaptop, screenSize,
  };
};

export default useScreenSize;
