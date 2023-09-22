import { useEffect, useState } from 'react';

const useDebounced = (value: boolean, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('new timeout');
      setDebouncedValue(value);
    }, delay);

    return () => {
      console.log('clear timeout');
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounced;
