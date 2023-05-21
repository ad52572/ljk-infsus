import React from "react";
import { WrapperComponent } from "@/components/wrapper-component";

// noinspection JSUnusedGlobalSymbols
export const metadata = {
  title: "INFSUS - LJK",
  description: "Application for INFSUS project",
};
// noinspection JSUnusedGlobalSymbols
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <WrapperComponent>{children}</WrapperComponent>
      </body>
    </html>
  );
}
