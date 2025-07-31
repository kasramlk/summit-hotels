import React from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
  Treemap,
  Cell
} from 'recharts';

interface ChartData {
  [key: string]: any;
}

interface AdvancedAreaChartProps {
  data: ChartData[];
  dataKeys: { key: string; color: string; label: string }[];
  height?: number;
  title?: string;
}

export const AdvancedAreaChart: React.FC<AdvancedAreaChartProps> = ({
  data,
  dataKeys,
  height = 300,
  title
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <defs>
        {dataKeys.map((item, index) => (
          <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={item.color} stopOpacity={0.1} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip
        contentStyle={{
          backgroundColor: 'hsl(var(--popover))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      />
      {dataKeys.map((item, index) => (
        <Area
          key={item.key}
          type="monotone"
          dataKey={item.key}
          stackId="1"
          stroke={item.color}
          fill={`url(#gradient-${index})`}
          name={item.label}
        />
      ))}
    </ComposedChart>
  </ResponsiveContainer>
);

interface GaugeChartProps {
  value: number;
  maxValue: number;
  title: string;
  color?: string;
  height?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  maxValue,
  title,
  color = 'hsl(var(--primary))',
  height = 200
}) => {
  const data = [
    {
      name: title,
      value: value,
      fill: color
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="90%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          dataKey="value"
          cornerRadius={10}
          fill={color}
          max={maxValue}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
          {value}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

interface TreemapChartProps {
  data: Array<{
    name: string;
    size: number;
    fill?: string;
  }>;
  height?: number;
}

export const TreemapChart: React.FC<TreemapChartProps> = ({ data, height = 300 }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#fff"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
        ))}
      </Treemap>
    </ResponsiveContainer>
  );
};

interface MetricComparison {
  metric: string;
  current: number;
  previous: number;
  target: number;
}

interface ComparisonChartProps {
  data: MetricComparison[];
  height?: number;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, height = 300 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip
        contentStyle={{
          backgroundColor: 'hsl(var(--popover))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }}
      />
      <Bar dataKey="previous" fill="hsl(var(--muted))" name="Previous Period" />
      <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Period" />
      <Line
        type="monotone"
        dataKey="target"
        stroke="hsl(var(--destructive))"
        strokeWidth={2}
        strokeDasharray="5 5"
        name="Target"
        dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
      />
    </ComposedChart>
  </ResponsiveContainer>
);