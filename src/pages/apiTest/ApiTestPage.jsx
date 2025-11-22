import { useState } from "react";
import '../../index.css'


export default function ApiTestPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const handleSignupTest = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const url = `https://cross-note.com/auth/local/signup`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "테스트유저",
          email: "test1@example.com",
          password: "password123",
          passwordCheck: "password123",
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || `에러 상태 코드: ${res.status}`);
      }

      setResult(text);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>백엔드 API 연결 테스트 - 회원가입</h1>

      <p>현재 백엔드 주소: https://cross-note.com</p>

      <button onClick={handleSignupTest} disabled={loading}>
        {loading ? "요청 보내는 중..." : "테스트 회원가입 요청 보내기"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>
          에러: {error}
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        <h2>서버 응답</h2>
        <pre
          style={{
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
            fontSize: 14,
            whiteSpace: "pre-wrap",
          }}
        >
          {result || "아직 서버 응답이 없습니다. 위 버튼을 눌러보세요."}
        </pre>
      </div>
    </div>
  );
}
