'use client';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { formatPercentage } from '@lib/utils';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

//15/03
//day/month
const formatDate = (date: Date) => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.unshift({
      name: formatDate(new Date(Date.now() - i * 1000 * 60 * 60 * 24)),
      percents: Math.floor(Math.random() * 1000),
    });
  }

  const average = data.reduce((acc, item) => acc + item.percents, 0) / data.length;

  return { data, average };
};

const { data, average } = generateMockData();

const CustomTooltip = <TValue extends ValueType, TName extends NameType>({
  payload: _payload,
}: TooltipProps<TValue, TName>) => {
  if (_payload && _payload.length) {
    console.log({ _payload });
    const { name: label, payload } = _payload[0];

    const desc = payload['name'];
    const value = payload[label];

    return (
      <div className='bg-lime-200'>
        <p className='label'>{desc}</p>
        <p className='desc'>{value}</p>
      </div>
    );
  }

  return null;
};

export function TestChart() {
  const { lng } = useParams(VaultPage);
  return (
    <div className={'z-[500] p-4 backdrop-blur-[2px]'}>
      <LineChart
        style={{
          zIndex: 5000,
        }}
        width={600}
        height={300}
        data={data}
        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
      >
        <Line type='monotone' dataKey='percents' stroke='#8884d8' />
        <ReferenceLine
          strokeDasharray='3 3'
          y={average}
          name={'Average'}
          stroke={'rgb(77, 178, 88)'}
        />

        <CartesianGrid strokeDasharray='3 3' stroke={'rgba(222,222,222, 0.5)'} />
        <Tooltip cursor={<CustomTooltip />} />
        <Legend />
        <XAxis dataKey='name' />
        <YAxis
          width={100}
          dataKey='percents'
          tickFormatter={(tick) => formatPercentage(tick, lng)}
        />
      </LineChart>
    </div>
  );
}
