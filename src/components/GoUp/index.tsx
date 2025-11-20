"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function GoUp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300); // mostra depois de descer 300px
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-18 right-4 p-3 rounded-full bg-primary text-white shadow-lg 
                 hover:scale-110 transition-all"
    >
      <ArrowUp size={22} />
    </button>
  );
}
