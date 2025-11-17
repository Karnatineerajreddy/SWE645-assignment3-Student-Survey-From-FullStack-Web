import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1>🎓 Student Survey – SWE 645</h1>
      </header>

      {/* Intro Section */}
      <section className="home-card">
        <h2>Welcome to the Student Survey Application</h2>
        <p>
          This application allows prospective students to provide feedback
          about their campus visit. Your responses help us improve the overall
          university experience for future students.
        </p>

        <div className="home-buttons">
          <Link to="/new" className="btn btn-green">📝 Fill Out Survey</Link>
          <Link to="/surveys" className="btn btn-blue">📋 View All Surveys</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>Developed for SWE 645 - Assignment 3</p>
        <p>© 2025 Neeraj Reddy Karnati & Abhinav Reddy Telkala</p>
      </footer>
    </div>
  );
}
