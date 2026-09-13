// Minimal stroke icon set for calculator nav (Heroicons-style, hand-authored to avoid a dependency).

const base = {
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.8,
  stroke: 'currentColor',
};

export function TrendingUpIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M15 7h6v6" />
    </svg>
  );
}

export function BanknoteIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.75" />
      <path strokeLinecap="round" d="M6 9v0M18 15v0" />
    </svg>
  );
}

export function LockIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 10.5V7a4.5 4.5 0 019 0v3.5" />
    </svg>
  );
}

export function RepeatIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h13l-3-3M20 17H7l3 3" />
    </svg>
  );
}

export function FlagIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 4.5h11l-2.5 3.5L16 11.5H5" />
    </svg>
  );
}

export function ScaleIcon({ className }) {
  return (
    <svg {...base} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M4 7h6M14 7h6M4 7l-2 5a3 3 0 006 0l-2-5M20 7l-2 5a3 3 0 006 0l-2-5" />
    </svg>
  );
}
