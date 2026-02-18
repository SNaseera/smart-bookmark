export const metadata = {
  title: "Smart Bookmark",
  description: "Bookmark manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial", padding: "20px" }}>
        {children}
      </body>
    </html>
  );
}
