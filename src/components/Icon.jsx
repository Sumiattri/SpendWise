const paths = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  transactions: (
    <>
      <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4" />
    </>
  ),
  categories: (
    <>
      <path d="m12 3 9 9-9 9-9-9 9-9Z" />
      <path d="m8 12 4 4 4-4-4-4-4 4Z" />
    </>
  ),
  settings: (
    <>
      <path
        d="m9 3-.6 2.2-2 .9L4.3 6 2.8 8.6l1.5 1.7-.1 2.3L2.8 14l1.5 2.6 2.3-.1 1.9 1.1L9 20h3l.6-2.4 2-1.1 2.3.1 1.5-2.6-1.5-1.4v-2.3l1.5-1.7L16.9 6l-2.2.1-2.1-.9L12 3Z"
        transform="translate(1.5 .5)"
      />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M7 3v4m10-4v4M3 11h18" />
    </>
  ),
  arrowUp: (
    <>
      <path d="m7 17 10-10M7 7h10v10" />
    </>
  ),
  arrowDown: (
    <>
      <path d="m7 7 10 10M7 17h10V7" />
    </>
  ),
  trendUp: <path d="m3 17 6-6 4 4 8-10m-6 0h6v6" />,
  wallet: (
    <>
      <path d="M20 8V6a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h15v10H6a3 3 0 0 1-3-3V7" />
      <path d="M21 12h-5v5h5" />
      <path d="M17.5 14.5h.1" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 7h6M9 11h6M9 15h3" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  utensils: (
    <>
      <path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18m11 0V3c-4 3-5 8-1 9h1" />
    </>
  ),
  car: (
    <>
      <path d="m5 7 2-4h10l2 4 2 3v8H3v-8l2-3ZM3 10h18M6 18v3m12-3v3M6 14h2m8 0h2" />
    </>
  ),
  bag: (
    <>
      <path d="M5 7h14l2 14H3L5 7Z" />
      <path d="M8 9V6a4 4 0 0 1 8 0v3" />
    </>
  ),
  play: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <path d="m10 8 6 4-6 4V8Z" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" />
    </>
  ),
  heart: (
    <>
      <path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z" />
      <path d="M6 12h3l2-3 2 6 2-3h3" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="3" />
      <path d="M8 7V3h8v4M3 12a22 22 0 0 0 18 0M10 13v3h4v-3" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20M6 15h3" />
    </>
  ),
  bank: (
    <>
      <path d="m3 8 9-5 9 5H3ZM5 11v7m7-7v7m7-7v7M3 21h18" />
    </>
  ),
  cash: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M5 9v6m14-6v6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  leaf: (
    <>
      <path d="M20 3C9 2 2 9 5 16s16 5 15-13Z" />
      <path d="M3 21 15 9" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  filter: (
    <>
      <path d="M4 7h16M4 17h16" />
      <circle cx="9" cy="7" r="3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="3" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function Icon({ name, size = 20, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name] || paths.receipt}
    </svg>
  );
}
