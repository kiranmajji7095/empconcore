import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardCharts = ({ ats, exam }) => {
  return (
    <div className="hfdb-stats-grid">
      <div className="hfdb-stat-card">
        <p className="hfdb-stat-title">ATS Score</p>
        <Doughnut
          data={{
            datasets: [{
              data: [ats, 100 - ats],
              backgroundColor: ["#6366f1", "#e5e7eb"]
            }]
          }}
        />
      </div>

      <div className="hfdb-stat-card">
        <p className="hfdb-stat-title">Exam Score</p>
        <Doughnut
          data={{
            datasets: [{
              data: [exam, 100 - exam],
              backgroundColor: ["#16a34a", "#e5e7eb"]
            }]
          }}
        />
      </div>
    </div>
  );
};

export default DashboardCharts;
