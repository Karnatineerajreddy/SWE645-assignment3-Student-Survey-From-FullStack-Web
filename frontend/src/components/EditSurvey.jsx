import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SurveyForm.css";

export default function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  // ✔ Use the NodePort exposed backend
  const API_BASE = "http://100.30.1.131:30080";

  useEffect(() => {
    async function loadSurvey() {
      try {
        const res = await axios.get(`${API_BASE}/surveys/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Error loading survey:", err);
        setMessage("❌ Failed to load survey.");
      }
    }
    loadSurvey();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/surveys/${id}`, form);
      setMessage("✅ Survey updated successfully!");
      setTimeout(() => navigate("/surveys"), 1500);
    } catch (err) {
      console.error("Error updating survey:", err);
      setMessage("❌ Failed to update survey.");
    }
  };

  if (!form) return <p>Loading survey...</p>;

  return (
    <div className="survey-container">
      <div className="survey-header">
        <h2>Edit Survey – #{id}</h2>
      </div>

      <form className="survey-form" onSubmit={handleSubmit}>
        <input name="first_name" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" value={form.last_name} onChange={handleChange} required />
        <input name="email" value={form.email} onChange={handleChange} required />
        <input name="city" value={form.city} onChange={handleChange} required />
        <input name="state" value={form.state} onChange={handleChange} required />
        <input name="telephone" value={form.telephone} onChange={handleChange} required />
        <textarea name="comments" value={form.comments} onChange={handleChange} rows="3" />

        <button type="submit" className="btn btn-edit">Save Changes</button>

        {message && <div className="result">{message}</div>}
      </form>
    </div>
  );
}
