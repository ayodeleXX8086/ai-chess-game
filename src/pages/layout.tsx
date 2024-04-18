"use client";
import ImportBsJS from "../utils/importBsJS";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("I'm here");
  return (
    <>
      <ImportBsJS />
      {children}
    </>
  );
}
