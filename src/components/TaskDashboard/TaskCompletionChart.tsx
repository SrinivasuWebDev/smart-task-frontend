import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Task = {
  id: number;
  name: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
};

type ChartData = {
  date: string;
  count: number;
};

type Props = {
  tasks: Task[];
};

const TaskCompletionChart = ({ tasks }:Props) => {
  const [data, setData] = useState<ChartData[]>([]);

  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const formatted = day.toISOString().split("T")[0];
      days.push(formatted);
    }
    return days;
  };

  const chartData = useMemo(() => {
    const days = getLast7Days();
    const countByDate: { [date: string]: number } = {};

    days.forEach(date => {
      countByDate[date] = 0;
    });

    tasks.forEach(task => {
      if (task.status === "COMPLETED") {
        const date = task.dueDate.split("T")[0];
        if (countByDate[date] !== undefined) {
          countByDate[date]++;
        }
      }
    });

    return days.map(date => ({
      date,
      count: countByDate[date],
    }));
  }, [tasks]);

  useEffect(() => {
    setData(chartData);
  }, [chartData]);

  return (
    <div className="bg-light p-3 rounded shadow mb-4">
      <h5 className="text-center mb-3">Tasks Completed in Last 7 Days</h5>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorComplete" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0d6efd"
            fillOpacity={1}
            fill="url(#colorComplete)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskCompletionChart;