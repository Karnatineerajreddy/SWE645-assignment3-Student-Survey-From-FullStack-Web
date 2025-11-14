import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./SurveyForm.css";

export default function SurveyForm() {
  const navigate = useNavigate();

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
    comments: "",
  });

  const [message, setMessage] = useState("");

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
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/", {
        ...form,
        liked_most: form.liked_most.join(", "),
      });

      setMessage("✅ Survey submitted successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ Failed to submit survey.");
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-header">
        <h2>Student Survey – SWE 645</h2>
      </div>

      <form className="survey-form" onSubmit={handleSubmit}>
        <div className="grid">
          <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name *" required />
          <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name *" required />
          <input name="street_address" value={form.street_address} onChange={handleChange} placeholder="Street Address *" required />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City *" required />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State *" required />
          <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP *" required />
          <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Telephone *" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email *" required />
        </div>

        <label>Date of Survey *</label>
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

        <label>Recommendation likelihood *</label>
        <select name="likelihood" value={form.likelihood} onChange={handleChange} required>
          <option value="">Select</option>
          <option>Very Likely</option>
          <option>Likely</option>
          <option>Unlikely</option>
        </select>

        <label>Comments</label>
        <textarea name="comments" rows="3" value={form.comments} onChange={handleChange} />

        <div className="buttons">
          <button className="btn btn-green" type="submit">Submit</button>
          <button className="btn btn-red" type="reset">Cancel</button>
        </div>

        {message && <div className="result">{message}</div>}

        <button className="back-btn" type="button" onClick={() => navigate("/")}>← Back</button>
      </form>
    </div>
  );
}
