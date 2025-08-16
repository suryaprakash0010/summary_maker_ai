import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata = {
  title: "Meeting Notes Summarizer",
  description: "AI-powered meeting transcript summarization tool",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}

/* Adding gradient background to body */
body {
  background: linear-gradient(
    135deg,
    #f8d7e2,   /* soft pink */
    #e6e6fa,   /* lavender */
    #dbeafe,   /* light blue */
    #ffffff    /* white */
  );
  background-attachment: fixed;
  background-size: cover;
  margin: 0;
  min-height: 100vh;
}

/* Adding primary blue button styles */
button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #2563eb;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

button.secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

button.secondary:hover {
  background-color: #e5e7eb;
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
