import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SurveyForm.css";

export default function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔥 Use your backend LoadBalancer IP
  const API_BASE = "http://100.30.1.131:8000";

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    street_address: "",
    city: "",
    state: "",
    zip: "",
    telephone: "",
    email: "",
    date_of_survey: "",
    liked_most: [],
    became_interested: "",
    likelihood: "",
    comments: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ============================
  // Load survey by ID for editing
  // ============================
  useEffect(() => {
    async function fetchSurvey() {
      try {
        const res = await axios.get(`${API_BASE}/surveys/${id}`);
        const data = res.data;

        setForm({
          ...data,
          liked_most: data.liked_most ? data.liked_most.split(", ") : [],
        });
      } catch (err) {
        console.error("Error loading survey:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSurvey();
  }, [id]);

  // ============================
  // Handle field updates
  // ============================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        liked_most: checked
          ? [...prev.liked_most, value]
          : prev.liked_most.filter((v) => v !== value),
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ============================
  // Submit update
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_BASE}/surveys/${id}`, {
        ...form,
        liked_most: form.liked_most.join(", "),
      });

      setMessage("✅ Survey updated successfully!");

      setTimeout(() => navigate("/surveys"), 1500);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Failed to update survey.");
    }
  };

  if (loading) return <p>Loading survey...</p>;

  return (
    <div className="survey-container">
      <div className="survey-header">
        <h2>Edit Survey #{id}</h2>
      </div>

      <form className="survey-form" onSubmit={handleSubmit}>
        <div className="grid">
          <input name="first_name" value={form.first_name} placeholder="First Name" onChange={handleChange} required />
          <input name="last_name" value={form.last_name} placeholder="Last Name" onChange={handleChange} required />
          <input name="street_address" value={form.street_address} placeholder="Street Address" onChange={handleChange} required />
          <input name="city" value={form.city} placeholder="City" onChange={handleChange} required />
          <input name="state" value={form.state} placeholder="State" onChange={handleChange} required />
          <input name="zip" value={form.zip} placeholder="ZIP" onChange={handleChange} required />
          <input name="telephone" value={form.telephone} placeholder="Telephone Number" onChange={handleChange} required />
          <input name="email" value={form.email} type="email" placeholder="Email" onChange={handleChange} required />
        </div>

        <label>Date of Survey *</label>
        <input type="date" name="date_of_survey" value={form.date_of_survey} onChange={handleChange} required />

        <fieldset>
          <legend>What did you like most about the campus?</legend>
          {["Students", "Location", "Campus", "Atmosphere", "Dorm Rooms", "Sports"].map((v) => (
            <label key={v}>
              <input
                type="checkbox"
                value={v}
                checked={form.liked_most.includes(v)}
                onChange={handleChange}
              />
              {v}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>How did you become interested?</legend>
          {["Friends", "Television", "Internet", "Other"].map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="became_interested"
                value={v}
                checked={form.became_interested === v}
                onChange={handleChange}
              />{" "}
              {v}
            </label>
          ))}
        </fieldset>

        <label>How likely to recommend?</label>
        <select name="likelihood" value={form.likelihood} onChange={handleChange} required>
          <option value="">Select</option>
          <option>Very Likely</option>
          <option>Likely</option>
          <option>Unlikely</option>
        </select>

        <label>Comments</label>
        <textarea name="comments" rows="3" value={form.comments} onChange={handleChange} />

        <div className="buttons">
          <button type="submit" className="btn btn-green">Save Changes</button>
          <button type="button" className="btn btn-red" onClick={() => navigate("/surveys")}>Cancel</button>
        </div>

        {message && <div className="result">{message}</div>}
      </form>
    </div>
  );
}
