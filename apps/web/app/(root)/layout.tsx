import React from "react";
import Navbar from "../../components/navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
}
