import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  import { useMemo } from "react";
  import { format, parseISO, isAfter, startOfToday } from "date-fns";
  
  type Task = {
    id: number;
    dueDate: string;
    status: string;
  };
  
  interface Props {
    tasks: Task[];
  }
  
  const UpcomingTasksChart = ({ tasks }: Props) => {
    const data = useMemo(() => {
      const grouped: Record<string, number> = {};
  
      tasks.forEach((task) => {
        if (
          task.status === "PENDING" &&
          isAfter(parseISO(task.dueDate), startOfToday())
        ) {
          const key = format(parseISO(task.dueDate), "yyyy-MM-dd");
          grouped[key] = (grouped[key] || 0) + 1;
        }
      });
  
      // Convert to chart data format
      return Object.entries(grouped)
        .map(([date, count]) => ({
          date: format(parseISO(date), "dd MMM (EEE)"),
          count,
        }))
        .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    }, [tasks]);
  
    return (
      <div className="bg-light p-3 rounded shadow mb-4">
        <h5 className="text-center mb-3">📅 Upcoming Tasks by Due Date</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#198754" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default UpcomingTasksChart;
  