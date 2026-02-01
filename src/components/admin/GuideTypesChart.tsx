'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Dummy data for guide types distribution
const data = [
  { name: '호텔', value: 30, count: 115 },
  { name: '펜션', value: 25, count: 96 },
  { name: '에어비앤비', value: 20, count: 77 },
  { name: '게스트하우스', value: 15, count: 58 },
  { name: '기타', value: 10, count: 38 },
];

// Colors for each segment (using distinct, non-gradient colors)
const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'];

interface TooltipPayload {
  name: string;
  value: number;
  payload: {
    name: string;
    value: number;
    count: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

interface LabelEntry {
  value: number;
}

// Custom tooltip
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          {payload[0].value}% ({payload[0].payload.count}개)
        </p>
      </div>
    );
  }
  return null;
};

// Custom label to show percentage
const renderCustomLabel = (entry: LabelEntry) => {
  return `${entry.value}%`;
};

export default function GuideTypesChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        가이드 유형 분포
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => {
                const item = data.find((d) => d.name === value);
                return `${value} (${item?.count}개)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
