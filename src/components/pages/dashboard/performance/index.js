import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const Performance = () => {
  const [data, setData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fromExam = location.state?.fromExam;

  useEffect(() => {
    // 🔐 Protect page
    if (!fromExam) {
      navigate("/dashboard/home");
      return;
    }

    fetch("http://localhost:4000/user/performance/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setData({
            ats_score: Number(d.ats_score || 0),
            exam_score: Number(d.exam_score || 0)
          });
        }
      });
  }, [fromExam, navigate]);

  if (!data) return <p>Loading performance...</p>;

  const getAtsColor = (score) => {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#facc15";
    return "#ef4444";
  };

  return (
    <div className="performance-wrapper">
      <h2>📊 Performance Overview</h2>

      <div className="performance-grid">

        {/* ATS SCORE */}
        <div className="chart-card">
          <h4>ATS Score</h4>

          <Doughnut
            data={{
              datasets: [{
                data: [data.ats_score, 100 - data.ats_score],
                backgroundColor: [
                  getAtsColor(data.ats_score),
                  "#e5e7eb"
                ],
                borderWidth: 0,
                cutout: "75%"
              }]
            }}
            options={{
              plugins: {
                legend: { display: false }
              }
            }}
          />

          <div className="center-score">
            {data.ats_score}%
          </div>
        </div>

        {/* EXAM SCORE */}
        <div className="chart-card">
          <h4>Exam Score</h4>

          <Bar
            data={{
              labels: ["Exam Score"],
              datasets: [{
                data: [data.exam_score],
                backgroundColor: "#4f46e5",
                borderRadius: 10
              }]
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />

          <div className="score-label">
            {data.exam_score} / 100
          </div>
        </div>

      </div>
    </div>
  );
};

export default Performance;