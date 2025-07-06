import { useEffect, useState, useRef } from "react";
import "../src/pageStyles/Level2.css";

const Level2 = () => {
  const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const GRID_SIZE = 9;

  const [grid, setGrid] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState(Array(GRID_SIZE).fill(null));
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const shuffled = ALPHABETS.sort(() => 0.5 - Math.random()).slice(0, GRID_SIZE);
    setGrid(shuffled);
  }, []);

  useEffect(() => {
    if (grid.length === 0 || currentIndex >= GRID_SIZE) return;

    const currentLetter = grid[currentIndex];

    const utterance = new SpeechSynthesisUtterance(currentLetter);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    const timeout = setTimeout(() => {
      setListening(true);
      startRecognition(currentLetter);
    }, 1500);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [grid, currentIndex]);

  const startRecognition = (expected) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim().toUpperCase();
      const isCorrect = spoken === expected.toUpperCase();

      setResults((prev) => {
        const updated = [...prev];
        updated[currentIndex] = isCorrect ? "correct" : "wrong";
        return updated;
      });

      setListening(false);

      setTimeout(() => {
        if (currentIndex < GRID_SIZE - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 1000);
    };

    recognition.onerror = () => {
      setResults((prev) => {
        const updated = [...prev];
        updated[currentIndex] = "wrong";
        return updated;
      });

      setListening(false);

      setTimeout(() => {
        if (currentIndex < GRID_SIZE - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 1000);
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => recognition.abort();
  };

  return (
    <div className="level-container">
      <h2 className="title">Level 2: Read the Letters</h2>
      <p className="subtitle">Speak out the letters one by one as they are highlighted.</p>
      
      <div className="grid">
        {grid.map((letter, idx) => (
          <div
            key={idx}
            className={`grid-tile ${results[idx]} ${idx === currentIndex ? "active" : ""}`}
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="status">
        {listening && <p className="listening-text">🎙️ Listening...</p>}
        {!listening && currentIndex >= GRID_SIZE && <p className="done-text">✅ All done!</p>}
      </div>
    </div>
  );
};

export default Level2;
