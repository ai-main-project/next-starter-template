'use client';

import React from 'react';

const ChristmasHat = () => {
    return (
        <div className="christmas-hat" aria-hidden="true">
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hat-svg"
            >
                <path
                    d="M20 18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16H18C19.1046 16 20 16.8954 20 18Z"
                    fill="white"
                />
                <path
                    d="M12 4L4 16H20L12 4Z"
                    fill="#d42426"
                />
                <circle cx="12" cy="4" r="2" fill="white" />
            </svg>
            <style jsx>{`
        .christmas-hat {
          position: absolute;
          top: -12px;
          left: -8px;
          pointer-events: none;
          z-index: 10;
          transform: rotate(-15deg);
        }
        .hat-svg {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
      `}</style>
        </div>
    );
};

export default ChristmasHat;
