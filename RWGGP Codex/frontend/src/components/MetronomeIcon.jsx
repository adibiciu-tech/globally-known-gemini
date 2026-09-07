import React from 'react';

const MetronomeIcon = ({ className = "w-8 h-8", ...props }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Metronome body - triangle */}
    <path d="M32 8 L52 54 L12 54 Z" />
    {/* Base */}
    <rect x="10" y="54" width="44" height="4" rx="1" />
    {/* Pendulum arm */}
    <line x1="32" y1="48" x2="20" y2="16" />
    {/* Pendulum weight */}
    <circle cx="32" cy="42" r="5" />
    {/* Center line */}
    <line x1="32" y1="48" x2="32" y2="18" />
  </svg>
);

export default MetronomeIcon;
