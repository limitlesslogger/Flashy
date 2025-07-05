import { useEffect, useState, useRef } from "react";
import { generateDrillSet } from "../utils/generateDrillSet";
import "../src/pageStyles/Level1.css";

const Level1 = () => {
  const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [drill, setDrill] = useState([]);
  const [index, setIndex] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [showLetterIntro, setShowLetterIntro] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const subset = ALPHABETS.sort(() => 0.5 - Math.random()).slice(0, 5);
    const fullDrill = generateDrillSet(subset).slice(0, 25);
    setDrill(fullDrill);
    setIndex(0);
  }, []);

  useEffect(() => {
    if (!drill[index]) return;

    const currentLetter = drill[index];
    setShowLetterIntro(true);

    const utterance = new SpeechSynthesisUtterance(currentLetter);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    const timeout = setTimeout(() => {
      setShowLetterIntro(false);
      setListening(true);
      startRecognition(currentLetter);
    }, 1500);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [drill, index]);

  const startRecognition = (expected) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim().toUpperCase();
      setListening(false);

      if (spoken === expected.toUpperCase()) {
        const left = drill.length - index - 1;
        setOverlay({
          type: "correct",
          message: `🎉 You said "${spoken}"\nOne down, ${left} to go. Good job!`,
        });
      } else {
        setOverlay({
          type: "wrong",
          message: `❌ You said "${spoken}"\nKeep practicing, you’ll do great!`,
        });
      }

      setTimeout(() => {
        if (index < drill.length - 1) {
          setIndex((prev) => prev + 1);
          setOverlay(null);
        } else {
          setOverlay({
            type: "final",
            message: "🏆 You did great!\nCome back, practice more, be better!",
          });
        }
      }, 2000);
    };

    recognition.onerror = (event) => {
      setListening(false);
      setOverlay({
        type: "wrong",
        message: `⚠️ Error: ${event.error}`,
      });

      setTimeout(() => {
        if (index < drill.length - 1) {
          setIndex((prev) => prev + 1);
          setOverlay(null);
        }
      }, 2000);
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => recognition.abort();
  };

  return (
    <div className="level-container">
      {showLetterIntro && (
        <div className="overlay letter-intro">
          <div className="overlay-content">
            <div className="spoken-letter big">{drill[index]}</div>
            <p className="overlay-message">Get ready to say this letter</p>
          </div>
        </div>
      )}

      {listening && !overlay && (
        <div className="overlay listening-overlay">
          <div className="overlay-content">
            <div className="spoken-letter pulse">{drill[index]}</div>
            <p className="overlay-message listening-text">
              🎙️ Listening<span className="dot-anim">...</span>
            </p>
          </div>
        </div>
      )}

      {overlay ? (
        <div className={`overlay ${overlay.type}`}>
          <div className="overlay-content">
            <div className="spoken-letter">{drill[index]}</div>
            <p className="overlay-message">{overlay.message}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="letter-box">{drill[index]}</div>
          <p className="progress">
            {index + 1} / {drill.length}
          </p>
        </>
      )}
    </div>
  );
};

export default Level1;
