import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "./api.js";
import "./SurveyForm.css";

export default function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/surveys/${id}`);
        const data = res.data;

        data.liked_most = data.liked_most ? data.liked_most.split(", ").map((v) => v.trim()) : [];

        setForm(data);
      } catch (err) {
        console.error("Load Error:", err);
      }
    }
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        liked_most: checked
          ? [...prev.liked_most, value]
          : prev.liked_most.filter((v) => v !== value),
      }));
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/surveys/${id}`, {
        ...form,
        liked_most: form.liked_most.join(", "),
      });

      setMessage("✅ Updated successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Update Error:", err);
      setMessage("❌ Failed to update.");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="survey-container">
      <h2>Edit Survey</h2>

      <form className="survey-form" onSubmit={handleSubmit}>
        <div className="grid">
          <input name="first_name" value={form.first_name} onChange={handleChange} required />
          <input name="last_name" value={form.last_name} onChange={handleChange} required />
          <input name="street_address" value={form.street_address} onChange={handleChange} required />
          <input name="city" value={form.city} onChange={handleChange} required />
          <input name="state" value={form.state} onChange={handleChange} required />
          <input name="zip" value={form.zip} onChange={handleChange} required />
          <input name="telephone" value={form.telephone} onChange={handleChange} required />
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <label>Date of Survey</label>
        <input type="date" name="date_of_survey" value={form.date_of_survey} onChange={handleChange} required />

        <fieldset>
          <legend>What did you like most?</legend>
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
                required
              />
              {v}
            </label>
          ))}
        </fieldset>

        <label>Recommendation likelihood</label>
        <select name="likelihood" value={form.likelihood} onChange={handleChange} required>
          <option value="">Select</option>
          <option>Very Likely</option>
          <option>Likely</option>
          <option>Unlikely</option>
        </select>

        <label>Comments</label>
        <textarea name="comments" value={form.comments} onChange={handleChange} rows="3" />

        <div className="buttons">
          <button className="btn btn-green" type="submit">Update</button>
          <button className="btn btn-red" type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>

        {message && <div className="result">{message}</div>}
      </form>
    </div>
  );
}
