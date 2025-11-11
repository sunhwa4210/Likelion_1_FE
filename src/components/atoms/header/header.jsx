import React, { useState } from "react";
import "./header.css";
import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const titleMap = {
    "/": "CROSSXNOTE",
    "/balance-game": "BALANCE GAME",
    "/column": "COLUMN",
    "/qna": "QnA",
    "/mypage": "MY PAGE",
  };

  const currentTitle = titleMap[location.pathname] || "CROSSXNOTE";

  return (
    <header className="header">
      <div className="header__top">
        {/* 로고 클릭 시 메뉴 토글 */}
        <h1 className="header__logo" onClick={() => setOpen((v) => !v)}>
          {location.pathname === "/" ? (
            <>
              CROSS<span>X</span>NOTE
            </>
          ) : (
            currentTitle
          )}
        </h1>

        <button className="header__icon" aria-label="알림">
          <Bell size={20} />
        </button>
      </div>

      {open && (
        <nav className="header__menu" aria-label="주 메뉴">
          <ul>
            <li onClick={() => handleNavigate("/")}>CROSSXNOTE</li>
            <li onClick={() => handleNavigate("/balance-game")}>BALANCE GAME</li>
            <li onClick={() => handleNavigate("/column")}>COLUMN</li>
            <li onClick={() => handleNavigate("/qna")}>QnA</li>
            <li onClick={() => handleNavigate("/mypage")}>MY PAGE</li>
          </ul>
        </nav>
      )}
    </header>
  );
}
