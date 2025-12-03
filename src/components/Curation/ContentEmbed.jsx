// src/components/Curation/ContentEmbed.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ContentEmbed.css";

// 유튜브 URL인지 판별
function isYoutubeUrl(url) {
  if (!url) return false;
  return url.includes("youtube.com/watch") || url.includes("youtu.be/");
}

// 유튜브 watch URL → embed URL로 변환
function toYoutubeEmbedUrl(url) {
  try {
    const u = new URL(url, window.location.origin);

    // youtu.be/VIDEO_ID
    if (u.hostname === "youtu.be") {
      const videoId = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtube.com/watch?v=VIDEO_ID
    const v = u.searchParams.get("v");
    if (v) {
      return `https://www.youtube.com/embed/${v}`;
    }

    // 그 외(플레이리스트 등)은 일단 원본 사용
    return url;
  } catch (e) {
    // URL 파싱 실패하면 그냥 원본 반환
    return url;
  }
}
//도메인 가져오기
function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function ContentEmbed({ url }) {
  if (!url) return null;

  // 1) 유튜브면 iframe 임베드
  if (isYoutubeUrl(url)) {
    const embedUrl = toYoutubeEmbedUrl(url);

    return (
      <div className="embed-box">
        <iframe
          src={embedUrl}
          title="임베드 콘텐츠"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 2) 내부 라우트 (SPA 라우팅) → Link 사용
  if (url.startsWith("/")) {
    return (
      <Link className="embed-box link-embed" to={url}></Link>
    );
  }

  // 3) 그 외는 모두 외부 링크로 새 탭 오픈
  return (
    <a
      className="embed-box link-embed"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <div className="link-preview">
        <div className="link-title">{getDomain(url)}</div>
        <div className="link-desc">클릭하면 링크로 이동합니다.</div>
      </div>
    </a>
  );
}
