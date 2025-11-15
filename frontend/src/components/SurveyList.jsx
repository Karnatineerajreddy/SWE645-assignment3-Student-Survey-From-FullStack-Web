import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // 👈 ADD THIS
import API from "../api.js";
import "./SurveyList.css";

export default function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();    // 👈 detects page navigation

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/surveys/");
        setSurveys(res.data);
      } catch (err) {
        console.error("Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [location]);   // 👈 REFRESH LIST EVERY TIME YOU NAVIGATE HERE

  const deleteSurvey = async (id) => {
    if (!window.confirm("Delete this survey?")) return;

    try {
      await API.delete(`/surveys/${id}`);
      setSurveys((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  if (loading) return <p>Loading surveys...</p>;

  return (
    <div className="survey-list-container">
      <div className="survey-list-header">
        <h2>📋 All Submitted Surveys</h2>
      </div>

      <table className="survey-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>State</th>
            <th>Date</th>
            <th>Liked Most</th>
            <th>Interested By</th>
            <th>Recommend</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {surveys.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.first_name} {s.last_name}</td>
              <td>{s.email}</td>
              <td>{s.city}</td>
              <td>{s.state}</td>
              <td>{s.date_of_survey}</td>
              <td>{s.liked_most}</td>
              <td>{s.became_interested}</td>
              <td>{s.likelihood}</td>
              <td>
                <button className="btn btn-edit" onClick={() => navigate(`/edit/${s.id}`)}>Edit</button>
                <button className="btn btn-delete" onClick={() => deleteSurvey(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
