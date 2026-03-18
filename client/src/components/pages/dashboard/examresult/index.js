import { useEffect, useState } from "react";
import "../../../styles/examresult.css";

const ExamResult = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/exam/result/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setResult(data.result);
      });
  }, []);

  if (!result) {
    return <p className="examresult-loading">Loading exam result...</p>;
  }

  return (
    <div className="examresult-wrapper">
      <div className="examresult-card">
        <h2 className="examresult-title">📝 Exam Result</h2>

        <div className="examresult-row">
          <span className="examresult-label">Role</span>
          <span className="examresult-value">{result.job_role}</span>
        </div>

        <div className="examresult-row">
          <span className="examresult-label">Score</span>
          <span className="examresult-value">{result.score}%</span>
        </div>

        <div className="examresult-row">
          <span className="examresult-label">Status</span>
          <span
            className={`examresult-status ${
              result.status === "PASS"
                ? "examresult-pass"
                : "examresult-fail"
            }`}
          >
            {result.status}
          </span>
        </div>

        <div className="examresult-row">
          <span className="examresult-label">Date</span>
          <span className="examresult-value">
            {new Date(result.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
