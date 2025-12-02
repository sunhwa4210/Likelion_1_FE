
import React, { useState, forwardRef } from "react";
import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./GlobalHeader.module.css"; 

function GlobalHeader(_, ref) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const titleMap = {
    "/curation/personal": "CROSSXNOTE",
    "/balance-game": "BALANCE GAME",
    "/column": "COLUMN",
    "/qna": "QnA",
    "/mypage": "MY PAGE",
  };

  const currentTitle = titleMap[location.pathname] || "CROSSXNOTE";

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        {/* 로고 클릭 시 메뉴 토글 */}

        <h1 ref={ref} className={styles.headerLogo} onClick={() => setOpen((v) => !v)}>
          {location.pathname === "/"||"/curation/personal" ? (
            <>
              CROSS<span>X</span>NOTE
            </>
          ) : (
            currentTitle
          )}
        </h1>

        <button className={styles.headerIcon} aria-label="알림">
          <Bell size={20} />
        </button>
      </div>

      {open && (
        <nav className={styles.headerMenu} aria-label="주 메뉴">
          <ul>
            <li onClick={() => handleNavigate("/curation/personal")}>CROSSXNOTE</li>
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
export default forwardRef(GlobalHeader);