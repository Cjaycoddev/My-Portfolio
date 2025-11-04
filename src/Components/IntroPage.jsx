import React, { useState, useEffect, useRef, useCallback } from "react";
import "../index.css"; // Tailwind/global styles

// --- CONFIG ---
const ROLES = ["web Developer", "Software Engineer","Data Analyst","UI/UX Designer", "Problem Solver"];
const INTRO_WORDS = ["Hi,", "I", "am", "Jonah Kimani😎"];

const INTRO_SOUND = "/Sounds/pop.mp3";          
const CYCLE_SOUND = "/Sounds/swoosh.mp3";       
const TRANSITION_SOUND = "/Sounds/transition.mp3"; 

const WORD_DELAY = 600;
const ROLE_DURATION = 3000;
const INTRO_DURATION = 16000;

// --- SIMPLE SOUND HOOK ---
const useSound = (url, volume = 0.7) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (url) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = volume;
    }
  }, [url]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return play;
};

export default function IntroPage({ onFinish }) {
  const [visibleWords, setVisibleWords] = useState([]);
  const [roleIndex, setRoleIndex] = useState(-1);
  const [showIamA, setShowIamA] = useState(false);

  const playIntro = useSound(INTRO_SOUND, 0.8);
  const playCycle = useSound(CYCLE_SOUND, 0.7);
  const playTransition = useSound(TRANSITION_SOUND, 0.9);

  useEffect(() => {
    INTRO_WORDS.forEach((word, i) => {
      setTimeout(() => {
        setVisibleWords((prev) => [...prev, word]);
        playIntro();
      }, i * WORD_DELAY);
    });

    const showIamATimer = setTimeout(() => {
      setShowIamA(true);
      playCycle();
    }, INTRO_WORDS.length * WORD_DELAY + 400);

    const startRolesTimer = setTimeout(() => {
      setRoleIndex(0);
    }, INTRO_WORDS.length * WORD_DELAY + 1200);

    const switchTimer = setTimeout(() => {
      playTransition();
      setTimeout(() => onFinish(), 1000);
    }, INTRO_DURATION);

    return () => {
      clearTimeout(showIamATimer);
      clearTimeout(startRolesTimer);
      clearTimeout(switchTimer);
    };
  }, [onFinish, playIntro, playCycle, playTransition]);

  useEffect(() => {
    if (roleIndex === -1) return;
    const cycle = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, ROLE_DURATION);
    return () => clearInterval(cycle);
  }, [roleIndex]);

  useEffect(() => {
    if (roleIndex >= 0) playCycle();
  }, [roleIndex, playCycle]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 font-mono">
      <h1 className="flex gap-3 mb-6">
        {INTRO_WORDS.map((word, i) => (
          <span
            key={i}
            className={`animate-pop ${
              word === "Hi," || word === "I’m"
                ? "text-3xl sm:text-5xl font-light text-cyan-300"
                : "text-4xl sm:text-6xl font-bold text-white"
            }`}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            {visibleWords.includes(word) ? word : ""}
          </span>
        ))}
      </h1>

      <div className="h-12 sm:h-16 flex items-center gap-3">
        {showIamA && (
          <span className="text-2xl sm:text-4xl text-gray-300 animate-iamA">
            I am a
          </span>
        )}
        {roleIndex >= 0 && (
          <span
            key={roleIndex}
            className="inline-block animate-rise-fall text-cyan-400 font-bold text-2xl sm:text-4xl"
            style={{ minWidth: "200px", textAlign: "left" }}
          >
            {ROLES[roleIndex]}
          </span>
        )}
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-pop {
          display: inline-block;
          animation: pop 0.5s ease forwards;
        }

        @keyframes riseFall {
          0% { transform: rotateX(90deg); opacity: 0; }
          20% { transform: rotateX(0deg); opacity: 1; }
          80% { transform: rotateX(0deg); opacity: 1; }
          100% { transform: rotateX(-90deg); opacity: 0; }
        }
        .animate-rise-fall {
          animation: riseFall 3s ease forwards;
          transform-origin: bottom;
          display: inline-block;
        }

        @keyframes iamAPop {
          0% { transform: scale(0.5) translateY(30px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-iamA {
          display: inline-block;
          animation: iamAPop 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
