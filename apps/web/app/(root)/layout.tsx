import React from "react";
import Navbar from "../../components/navbar";

import Footer from "../../components/footer";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl">
        <Navbar />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
