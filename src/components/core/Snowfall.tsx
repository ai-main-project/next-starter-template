'use client';

import React from 'react';

const Snowfall = () => {
  return (
    <div className="snowfall-container" aria-hidden="true">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="snowflake" />
      ))}
      <style jsx>{`
        .snowfall-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .snowflake {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          background: var(--snowflake-color);
          border-radius: 50%;
          opacity: 0.8;
          filter: blur(1px);
          animation: fall linear infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) translateX(20px) scale(0.5);
            opacity: 0;
          }
        }

        .snowflake:nth-child(2n) {
          width: 6px;
          height: 6px;
          animation-duration: 7s;
          animation-delay: 1s;
        }
        .snowflake:nth-child(3n) {
          width: 10px;
          height: 10px;
          animation-duration: 9s;
          animation-delay: 2s;
        }
        .snowflake:nth-child(4n) {
          width: 4px;
          height: 4px;
          animation-duration: 6s;
          animation-delay: 0.5s;
        }
        .snowflake:nth-child(5n) {
          width: 7px;
          height: 7px;
          animation-duration: 8s;
          animation-delay: 3s;
        }

        /* Distribute snowflakes horizontally */
        .snowflake:nth-child(1) { left: 5%; animation-duration: 8s; }
        .snowflake:nth-child(2) { left: 10%; animation-duration: 6s; animation-delay: 1s; }
        .snowflake:nth-child(3) { left: 15%; animation-duration: 9s; animation-delay: 0.5s; }
        .snowflake:nth-child(4) { left: 20%; animation-duration: 7s; animation-delay: 2s; }
        .snowflake:nth-child(5) { left: 25%; animation-duration: 8.5s; animation-delay: 1.5s; }
        .snowflake:nth-child(6) { left: 30%; animation-duration: 6.5s; animation-delay: 0.3s; }
        .snowflake:nth-child(7) { left: 35%; animation-duration: 10s; animation-delay: 2.5s; }
        .snowflake:nth-child(8) { left: 40%; animation-duration: 7.5s; animation-delay: 1.2s; }
        .snowflake:nth-child(9) { left: 45%; animation-duration: 8.2s; animation-delay: 0.8s; }
        .snowflake:nth-child(10) { left: 50%; animation-duration: 9.5s; animation-delay: 3s; }
        .snowflake:nth-child(11) { left: 55%; animation-duration: 7.2s; animation-delay: 1.8s; }
        .snowflake:nth-child(12) { left: 60%; animation-duration: 8.8s; animation-delay: 0.4s; }
        .snowflake:nth-child(13) { left: 65%; animation-duration: 6.8s; animation-delay: 2.2s; }
        .snowflake:nth-child(14) { left: 70%; animation-duration: 9.2s; animation-delay: 1.4s; }
        .snowflake:nth-child(15) { left: 75%; animation-duration: 7.8s; animation-delay: 2.8s; }
        .snowflake:nth-child(16) { left: 80%; animation-duration: 8.4s; animation-delay: 0.6s; }
        .snowflake:nth-child(17) { left: 85%; animation-duration: 7.4s; animation-delay: 2.4s; }
        .snowflake:nth-child(18) { left: 90%; animation-duration: 9.8s; animation-delay: 1.6s; }
        .snowflake:nth-child(19) { left: 95%; animation-duration: 8.6s; animation-delay: 0.2s; }
        .snowflake:nth-child(20) { left: 98%; animation-duration: 6.2s; animation-delay: 3.2s; }
      `}</style>
    </div>
  );
};

export default Snowfall;
