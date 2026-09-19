const AuthDoodle = () => {
  return (
    <svg
      className="absolute inset-0 h-full w-full text-sage/25"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="horizon-auth-doodle"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="14" r="3.2" fill="currentColor" />
          <circle cx="54" cy="8" r="1.6" fill="currentColor" />
          <path
            d="M36 6l1.2 3.4h3.6l-2.9 2.1 1.1 3.4L36 13.8 33 14.9l1.1-3.4-2.9-2.1h3.6z"
            fill="currentColor"
          />
          <path
            d="M62 28c4 0 6 4 6 8s-2 8-6 8-6-4-6-8 2-8 6-8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 42h8M12 38v8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M48 46c6-8 14-4 14 4 0 6-5 10-9 10-6 0-8-6-5-14z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="22" cy="62" r="2.2" fill="currentColor" />
          <path
            d="M64 58l6 6M70 58l-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#horizon-auth-doodle)" />
    </svg>
  );
};

export default AuthDoodle;
