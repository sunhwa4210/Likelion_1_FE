// src/components/Curation/ContentEmbed.jsx
import React from "react";
import "./ContentEmbed.css";

export default function ContentEmbed({ type, url }) {
  if (!url) return null; // 임베드할 URL 없으면 안 그림

  // 유튜브 임베드
  if (type === "youtube") {
    return (
      <div className="embed-box">
        <iframe
          src={url}
          title="임베드 콘텐츠"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 일반 링크 프리뷰 (심플 버전)
  if (type === "link") {
    return (
      <a
        className="embed-box link-embed"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <div className="link-embed-inner">
          <p className="link-embed-label">원문에서 보기</p>
          <p className="link-embed-url">{url}</p>
        </div>
      </a>
    );
  }

  // 타입은 있는데 아직 구현 안 된 경우 → 그냥 박스만
  return <div className="embed-box" />;
}
