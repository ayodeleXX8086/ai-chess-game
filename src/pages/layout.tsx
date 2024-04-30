"use client";
import ImportBsJS from "../utils/importBsJS";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ImportBsJS />
      {children}
    </>
  );
}
