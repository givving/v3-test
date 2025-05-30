/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useNavigate } from "@remix-run/react";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-10 shadow-sm">
      <div
        className="max-w-7xl mx-auto px-4 py-3"
        onClick={() => navigate("/")}
      >
        <div className="flex justify-center md:justify-start items-center cursor-pointer">
          {/* Logo - centered on mobile, left-aligned on md screens and up */}
          <div className="w-32">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </div>
        </div>
      </div>
    </header>
  );
};
