import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
// import "../../styles/adminchart.css";
import "./index.css"

const COLORS = ["#22c55e", "#ef4444"];

const AdminChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch chart data
  useEffect(() => {
    fetch("http://localhost:4000/admin/chart-data", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-chart-card">
      {/* Header */}
      <div className="chart-header">
        <h2>Candidate Status Overview</h2>
        <p>Approved vs Rejected Candidates</p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="chart-loading">
          <div className="spinner"></div>
          <span>Loading Chart...</span>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                  label
                  animationDuration={1200}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="chart-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: COLORS[index] }}
                ></span>
                <p>
                  {item.status} - <b>{item.count}</b>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminChart;
