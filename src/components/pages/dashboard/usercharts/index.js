import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserStatsChart = ({ ats, exam }) => {
  const data = {
    labels: ["ATS Score", "Remaining"],
    datasets: [
      {
        data: [ats, 100 - ats],
        backgroundColor: ["#6366f1", "#e5e7eb"]
      }
    ]
  };

  return <Doughnut data={data} />;
};

export default UserStatsChart;
