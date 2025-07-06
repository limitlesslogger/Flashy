import { useEffect, useState, useRef } from "react";
import "../src/pageStyles/Level3.css";

// Levenshtein distance helper
function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = [];
  for (let i = 0; i <= bn; ++i) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= an; ++j) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

const Level3 = () => {
  const WORDS = [
    "CAT", "DOG", "BAT", "MAP", "SON",
    "CAR", "TOP", "PEN", "JAM", "BOX"
  ];

  const [drill, setDrill] = useState([]);
  const [index, setIndex] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [showWordIntro, setShowWordIntro] = useState(false);
  const [listening, setListening] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const subset = WORDS.sort(() => 0.5 - Math.random()).slice(0, 10);
    setDrill(subset);
    setIndex(0);
  }, []);

  useEffect(() => {
    if (!drill[index]) return;

    const currentWord = drill[index];
    setShowWordIntro(true);

    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    const timeout = setTimeout(() => {
      setShowWordIntro(false);
      setListening(true);
      startRecognition(currentWord);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [drill, index]);

  const startRecognition = (expected) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.onresult = (event) => {
      const results = event.results[0];
      const spokenOptions = [];
      for (let i = 0; i < results.length; i++) {
        spokenOptions.push(results[i].transcript.trim().toUpperCase());
      }
      console.log("spokenOptions", spokenOptions);

      setListening(false);

      // fuzzy match
      const isCorrect = spokenOptions.some(
        (opt) =>
          opt === expected.toUpperCase() ||
          levenshtein(opt, expected.toUpperCase()) <= 1
      );

      if (isCorrect) {
        const left = drill.length - index - 1;
        setOverlay({
          type: "correct",
          message: `🎉 You said <b>${expected}</b><br>Only ${left} more to go!`,
        });
      } else {
        setOverlay({
          type: "wrong",
          message: `❌ You said <b>${spokenOptions[0]}</b><br>Try again!`,
        });
      }

      setTimeout(() => {
        if (index < drill.length - 1) {
          setIndex((prev) => prev + 1);
          setOverlay(null);
        } else {
          setCelebration(true);
          setOverlay({
            type: "final",
            message: "🏆 Awesome! You finished all the words.<br>Keep going, you’re a rockstar! 🚀",
          });
        }
      }, 2500);
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
      }, 2500);
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => recognition.abort();
  };

  return (
    <div className="level-container">
      {celebration && (
        <div className="celebration">
          <div className="cracker"></div>
          <div className="cracker"></div>
          <div className="cracker"></div>
        </div>
      )}

      {showWordIntro && (
        <div className="overlay word-intro fullpage">
          <div className="overlay-content">
            <div className="spoken-word big">{drill[index]}</div>
            <p className="overlay-message">Get ready to say <b>{drill[index]}</b></p>
          </div>
        </div>
      )}

      {listening && !overlay && (
        <div className="overlay listening-overlay fullpage">
          <div className="overlay-content">
            <div className="spoken-word pulse">{drill[index]}</div>
            <p className="overlay-message listening-text">
              🎙️ Listening<span className="dot-anim">...</span>
            </p>
          </div>
        </div>
      )}

      {overlay ? (
        <div className={`overlay ${overlay.type} fullpage`}>
          <div className="overlay-content">
            <div className="spoken-word">{drill[index]}</div>
            <p
              className="overlay-message"
              dangerouslySetInnerHTML={{ __html: overlay.message }}
            ></p>
          </div>
        </div>
      ) : (
        <>
          <div className="word-box">{drill[index]}</div>
          <p className="progress">
            {index + 1} / {drill.length}
          </p>
        </>
      )}
    </div>
  );
};

export default Level3;
