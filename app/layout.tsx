import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nithin - Portfolio",
  description:
    "Nithin's Portfolio - A computing student and full-stack developer building modern, responsive web applications.",
  keywords:
    "Nithin, portfolio, full-stack developer, web development, machine learning",
  openGraph: {
    title: "Nithin's Portfolio",
    description:
      "Explore my projects and skills as a computing student and tech enthusiast.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
