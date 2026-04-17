export const metadata = {
  title: "Pattern Battle",
  description: "Voice-based design patterns quiz with spaced repetition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
