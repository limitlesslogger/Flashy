import { Link } from "react-router-dom";
import "../src/pageStyles/LandingPage.css";

const LandingPage = () => {
  const levels = [
    { number: 1, title: "Beginner", description: "Easy pace" },
    { number: 2, title: "Novice", description: "Steady rhythm" },
    { number: 3, title: "Intermediate", description: "Quick thinking" },
    { number: 4, title: "Advanced", description: "Rapid response" },
    { number: 5, title: "Expert", description: "Lightning speed" },
  ];

  return (
    <div className="landing-container">
      <header className="header">
        <h1 className="main-title">Rapid Naming Drill</h1>
        <p className="subtitle">
          Master your speed and accuracy with progressive difficulty levels
        </p>
      </header>

      <div className="levels-grid">
        {levels.map((level) => (
          <Link
            className="level-card"
            to={`/level${level.number}`}
            key={level.number}
          >
            <div className="level-number">{level.number}</div>
            <div className="level-content">
              <h2 className="level-title">Level {level.number}</h2>
              <p className="level-difficulty">
                {level.title} - {level.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <p>© 2025 Rapid Naming Drill</p>
      </footer>
    </div>
  );
};

export default LandingPage;
