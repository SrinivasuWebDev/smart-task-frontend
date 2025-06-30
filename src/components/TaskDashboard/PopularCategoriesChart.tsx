import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Task = {
  id: number;
  category: string;
  status: string;
  dueDate: string;
};

type CategoryData = {
  category: string;
  count: number;
};

interface Props {
  tasks: Task[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

const PopularCategoriesChart = ({ tasks }: Props) => {
  const [data, setData] = useState<CategoryData[]>([]);

  useEffect(() => {
    const grouped: Record<string, number> = {};

    tasks.forEach(task => {
      if (task.category) {
        grouped[task.category] = (grouped[task.category] || 0) + 1;
      }
    });

    const formatted = Object.entries(grouped).map(([category, count]) => ({
      category,
      count,
    }));

    setData(formatted);
  }, [tasks]);

  return (
    <div className="bg-light p-3 rounded shadow mb-4">
      <h5 className="text-center mb-3">📊 Most Popular Task Categories</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularCategoriesChart;
