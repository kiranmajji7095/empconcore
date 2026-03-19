import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/exampage.css";

const ExamPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ✅ Correct values coming from ATS Screen
  const email = state?.email;
  const jobRole = state?.jobRole;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load Questions
  useEffect(() => {
    if (!email || !jobRole) {
      alert("Email or Job Role Missing!");
      navigate("/joblist");
      return;
    }

    fetch(`http://localhost:4000/exam/ai-questions/${email}/${jobRole}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load questions");
        setLoading(false);
      });
  }, [email, jobRole, navigate]);

  // ✅ Submit Exam
  const submitExam = async () => {
    setSubmitted(true);

    const res = await fetch("http://localhost:4000/exam/submit-exam", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({
    jobRole,
    answers,
    questions,
  }),
});

    const data = await res.json();
    setResult(data);

    // ✅ Redirect to Performance after submit
    setTimeout(() => {
      navigate("/dashboard/performance", {
        state: { fromExam: true }
      });
    }, 1500);
  };




  if (loading) return <h2 className="center">⏳ Loading Exam...</h2>;

  return (
    <div className="exam-container">
      <h2 className="exam-title">{jobRole} Skill Test</h2>

      {questions.map((q, i) => (
        <div key={i} className="question-card">
          <h4>{i + 1}. {q.question}</h4>

          {["A", "B", "C", "D"].map((opt) => (
            <label key={opt} className="option">
              <input
                type="radio"
                name={`q${i}`}
                disabled={submitted}
                checked={answers[i] === opt}
                onChange={() =>
                  setAnswers((prev) => ({ ...prev, [i]: opt }))
                }
              />
              {q["option" + opt]}
            </label>
          ))}
        </div>
      ))}

      {!submitted && (
        <button className="submit-btn" onClick={submitExam}>
          Submit Exam
        </button>
      )}

      {result && (
        <div className="result-box">
          <h3>{result.status === "PASS" ? "🎉 PASS" : "❌ FAIL"}</h3>
          <p>Score: {result.score}%</p>

          <button onClick={() => navigate("/joblist")}>
            Back to Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
