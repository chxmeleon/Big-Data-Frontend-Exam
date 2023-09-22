import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef } from 'react';

function Chart({ options }: { options: Highcharts.Options }) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <div className="pt-8 md:pt-20">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </div>
  );
}

export default Chart;
