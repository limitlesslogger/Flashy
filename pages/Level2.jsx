// // 
// import { useEffect, useRef, useState } from "react";
// import "../src/pageStyles/Level2.css";

// const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// const getRandomGrid = () => {
//   const shuffled = ALPHABETS.sort(() => 0.5 - Math.random()).slice(0, 9);
//   return shuffled;
// };

// const Level2 = () => {
//   const [grid, setGrid] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [listening, setListening] = useState(false);
//   const [results, setResults] = useState(Array(9).fill(null)); // "correct", "wrong", or null
//   const [spokenText, setSpokenText] = useState(""); // 🆕

//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     setGrid(getRandomGrid());
//     setCurrentIndex(0);
//     setResults(Array(9).fill(null));
//     setSpokenText("");
//   }, []);

//   useEffect(() => {
//     if (grid.length === 0 || currentIndex >= grid.length) return;

//     const currentLetter = grid[currentIndex];

//     const utterance = new SpeechSynthesisUtterance(currentLetter);
//     utterance.lang = "en-US";

//     utterance.onend = () => {
//       setListening(true);
//       startRecognition(currentLetter);
//     };

//     window.speechSynthesis.cancel(); // Clear previous
//     window.speechSynthesis.speak(utterance);

//     return () => {
//       window.speechSynthesis.cancel();
//       if (recognitionRef.current) recognitionRef.current.abort();
//     };
//   }, [grid, currentIndex]);

//   const startRecognition = (expected) => {
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onresult = (event) => {
//       const spoken = event.results[0][0].transcript.trim().toUpperCase();
//       setSpokenText(spoken); // 🆕

//       const isCorrect = spoken === expected.toUpperCase();

//       setResults((prev) => {
//         const updated = [...prev];
//         updated[currentIndex] = isCorrect ? "correct" : "wrong";
//         return updated;
//       });

//       setListening(false);

//       setTimeout(() => {
//         if (currentIndex < grid.length - 1) {
//           setCurrentIndex((prev) => prev + 1);
//           setSpokenText(""); // clear for next
//         }
//       }, 1000);
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech error:", event.error);
//       setSpokenText(`Error: ${event.error}`);
//       setResults((prev) => {
//         const updated = [...prev];
//         updated[currentIndex] = "wrong";
//         return updated;
//       });

//       setListening(false);

//       setTimeout(() => {
//         if (currentIndex < grid.length - 1) {
//           setCurrentIndex((prev) => prev + 1);
//           setSpokenText("");
//         }
//       }, 1000);
//     };

//     recognition.onspeechend = () => {
//       recognition.stop();
//     };

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   return (
//     <div className="level-container">
//       <h1 className="title">Level 2: Read the Letters</h1>
//       <p className="subtitle">Speak out the letters one by one as they are highlighted.</p>

//       <div className="grid">
//         {grid.map((letter, index) => (
//           <div
//             key={index}
//             className={`grid-tile ${
//               index === currentIndex
//                 ? "active"
//                 : results[index] === "correct"
//                 ? "correct"
//                 : results[index] === "wrong"
//                 ? "wrong"
//                 : ""
//             }`}
//           >
//             {letter}
//           </div>
//         ))}
//       </div>

//       <div className="status">
//         {listening ? (
//           <p className="listening-text">🎤 Listening...</p>
//         ) : currentIndex >= grid.length ? (
//           <p className="done-text">✅ Done! Great job!</p>
//         ) : null}

//         {spokenText && (
//           <p className="spoken-display">
//             You said: <strong>{spokenText}</strong>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Level2;

import { useEffect, useRef, useState } from "react";
import "../src/pageStyles/Level2.css";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomGrid = () => {
  const shuffled = ALPHABETS.sort(() => 0.5 - Math.random()).slice(0, 9);
  return shuffled;
};

const Level2 = () => {
  const [grid, setGrid] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState(Array(9).fill(null));
  const [spokenText, setSpokenText] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    setGrid(getRandomGrid());
    setCurrentIndex(0);
    setResults(Array(9).fill(null));
    setSpokenText("");
  }, []);

  useEffect(() => {
    if (grid.length === 0 || currentIndex >= grid.length) return;

    const currentLetter = grid[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentLetter);
    utterance.lang = "en-US";

    utterance.onend = () => {
      setListening(true);
      startRecognition(currentLetter);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [grid, currentIndex]);

  const startRecognition = (expected) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim().toUpperCase();
      setSpokenText(spoken);

      const isCorrect = spoken === expected.toUpperCase();

      setResults((prev) => {
        const updated = [...prev];
        updated[currentIndex] = isCorrect ? "correct" : "wrong";
        return updated;
      });

      setListening(false);

      setTimeout(() => {
        if (currentIndex < grid.length - 1) {
          setCurrentIndex((prev) => prev + 1);

          // 🕒 Delay clearing spoken text
          setTimeout(() => setSpokenText(""), 1000);
        }
      }, 1000);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setSpokenText(`Error: ${event.error}`);

      setResults((prev) => {
        const updated = [...prev];
        updated[currentIndex] = "wrong";
        return updated;
      });

      setListening(false);

      setTimeout(() => {
        if (currentIndex < grid.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setTimeout(() => setSpokenText(""), 1000);
        }
      }, 1000);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="level-container">
      <h1 className="title">Level 2: Read the Letters</h1>
      <p className="subtitle">Speak out the letters one by one as they are highlighted.</p>

      <div className="grid">
        {grid.map((letter, index) => (
          <div
            key={index}
            className={`grid-tile ${
              index === currentIndex
                ? "active"
                : results[index] === "correct"
                ? "correct"
                : results[index] === "wrong"
                ? "wrong"
                : ""
            }`}
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="status">
        {listening ? (
          <p className="listening-text">🎤 Listening...</p>
        ) : currentIndex >= grid.length ? (
          <p className="done-text">✅ Done! Great job!</p>
        ) : null}

        {spokenText && (
          <p className="spoken-display">
            You said: <strong>{spokenText}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Level2;
