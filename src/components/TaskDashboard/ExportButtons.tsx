// components/ExportButtons.tsx
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import { saveAs } from "file-saver";

type Props = {
  tasks: any[];
};

const ExportButtons = ({ tasks }: Props) => {
  const headers = [
    { label: "Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Category", key: "category" },
    { label: "Due Date", key: "dueDate" },
    { label: "Status", key: "status" },
  ];

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "tasks.xlsx");
  };

  const handlePdfExport = () => {
    const doc = new jsPDF();
    const tableData = tasks.map((task) => [
      task.name,
      task.description,
      task.category,
      task.dueDate,
      task.status,
    ]);
    autoTable(doc, {
      head: [["Name", "Description", "Category", "Due Date", "Status"]],
      body: tableData,
    });
    doc.save("tasks.pdf");
  };

  return (
    <div className="mb-3">
      <CSVLink
        data={tasks}
        headers={headers}
        filename={"tasks.csv"}
        className="btn btn-outline-success me-2"
      >
        Export CSV
      </CSVLink>
      <button className="btn btn-outline-primary me-2" onClick={handleExcelExport}>
        Export Excel
      </button>
      <button className="btn btn-outline-danger" onClick={handlePdfExport}>
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
