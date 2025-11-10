import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
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
    comments: ""
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
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/surveys/", { ...form, liked_most: form.liked_most.join(", ") });
      setMessage("✅ Survey submitted successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
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
          <input name="first_name" placeholder="First Name *" onChange={handleChange} required />
          <input name="last_name" placeholder="Last Name *" onChange={handleChange} required />
          <input name="street_address" placeholder="Street Address *" onChange={handleChange} required />
          <input name="city" placeholder="City *" onChange={handleChange} required />
          <input name="state" placeholder="State *" onChange={handleChange} required />
          <input name="zip" placeholder="ZIP *" onChange={handleChange} required />
          <input name="telephone" placeholder="Telephone Number *" onChange={handleChange} required />
          <input name="email" placeholder="Email *" type="email" onChange={handleChange} required />
        </div>

        <label>Date of Survey *</label>
        <input type="date" name="date_of_survey" onChange={handleChange} required />

        <fieldset>
          <legend>What did you like most about the campus?</legend>
          {["Students", "Location", "Campus", "Atmosphere", "Dorm Rooms", "Sports"].map((v) => (
            <label key={v}>
              <input type="checkbox" value={v} onChange={handleChange} /> {v}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>How did you become interested in the university?</legend>
          {["Friends", "Television", "Internet", "Other"].map((v) => (
            <label key={v}>
              <input type="radio" name="became_interested" value={v} onChange={handleChange} required /> {v}
            </label>
          ))}
        </fieldset>

        <label>How likely are you to recommend this school?</label>
        <select name="likelihood" onChange={handleChange} required>
          <option value="">Select</option>
          <option>Very Likely</option>
          <option>Likely</option>
          <option>Unlikely</option>
        </select>

        <label>Additional Comments</label>
        <textarea name="comments" rows="3" onChange={handleChange} placeholder="Your feedback..." />

        <div className="buttons">
          <button type="submit" className="btn btn-green">Submit</button>
          <button type="reset" className="btn btn-red">Cancel</button>
        </div>

        {message && <div className="result">{message}</div>}

        <button type="button" onClick={() => navigate("/")} className="back-btn">← Back to Home</button>
      </form>
    </div>
  );
}
