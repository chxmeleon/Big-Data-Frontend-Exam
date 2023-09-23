import { useEffect, useState } from 'react';

const useBtnEnable = (
  data: Record<string, string | undefined>,
  responseMessage: string | undefined,
) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  useEffect(() => {
    if (
      responseMessage !== '處理完成'
      || data?.district === undefined
      || data?.district === ''
      || data?.city === ''
    ) {
      setIsDisabled(true);
    } else {
      setTimeout(() => {
        setIsDisabled(false);
      }, 450);
    }
  }, [responseMessage, data]);

  return isDisabled;
};

export default useBtnEnable;
