import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SurveyList.css";

export default function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/surveys/");
        setSurveys(res.data);
      } catch (err) {
        console.error("Error fetching surveys:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const deleteSurvey = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/surveys/${id}`);
      setSurveys(surveys.filter((s) => s.id !== id)); // update UI
    } catch (err) {
      console.error("Error deleting survey:", err);
    }
  };

  if (loading) return <p className="loading">Loading surveys...</p>;

  return (
    <div className="survey-list-container">
      <div className="survey-list-header">
        <h2>📋 All Submitted Surveys</h2>
      </div>

      {surveys.length === 0 ? (
        <p className="empty">No surveys found.</p>
      ) : (
        <div className="survey-table-wrapper">
          <table className="survey-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>City</th>
                <th>State</th>
                <th>Date of Survey</th>
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
                    <button
                      className="btn btn-edit"
                      onClick={() => navigate(`/edit/${s.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteSurvey(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
