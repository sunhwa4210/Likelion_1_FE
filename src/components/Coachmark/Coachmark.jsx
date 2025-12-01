import React, { useState, useEffect } from "react";
import "./Coachmark.css";

export default function Coachmark({ targetRef, onNeverShowAgain }) {
  const [rect, setRect] = useState(null);
  const [menudescriptionTop,setMenudescriptionTop]=useState(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const target = targetRef.current.getBoundingClientRect();
    const wrapper = document.querySelector(".app-wrapper");

    if (!wrapper) return;
    const wrap = wrapper.getBoundingClientRect();

    const P = 3; // padding

    // app-wrapper 기준 좌표로 변환!
    const relativeTop = target.top - wrap.top;
    const relativeLeft = target.left - wrap.left;

    setRect({
      top: relativeTop - P,
      left: relativeLeft - P,
      width: target.width + P * 2,
      height: target.height + P * 2,
    });
  }, [targetRef]);

  useEffect(()=>{
  if(!rect) return;
  setMenudescriptionTop(rect.top+rect.height+13);
  },[rect]);

  if (!rect) return null;

  return (
    <div className="coachmark-overlay">

      {/* 로고 부분 구멍 */}
      <div
        className="coachmark-hole"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      />

      {/* 로고 설명  */}
      <div className="menu-description" style={{left: rect.left, top: menudescriptionTop, }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M7.99998 14.6668C11.6819 14.6668 14.6666 11.6821 14.6666 8.00016C14.6666 4.31826 11.6819 1.3335 7.99998 1.3335C4.31808 1.3335 1.33331 4.31826 1.33331 8.00016C1.33331 11.6821 4.31808 14.6668 7.99998 14.6668Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 10.6667V8" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 5.3335H8.0075" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
        <p> 로고를 눌러 메뉴를 열 수 있어요!</p>
      </div>



      {/* 설명 wapper */}
      <div className="coachmark-description-wrapper">
        <div className="p-wrapper">
          <h2>현재는 <span>사용자 맞춤 큐레이션 피드</span> 입니다.</h2>
          <p>더 많은 큐레이션을 보고 싶다면,<br/>
            화면 가장 아래의 <span>'큐레이션 더보기'</span> 버튼을 통해<br/>
            전체 큐레이션으로 이동할 수 있어요.
          </p>
        </div>
        <button onClick={onNeverShowAgain}>
          <p>다시 보지 않기</p>
          <span className="X">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5L4.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.5 4.5L13.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
