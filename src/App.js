import "./App.css";
import Header from "./components/atoms/header/header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Curation from "./pages/curation/curation";
import BalanceGame from "./pages/balancegame/balancegame";
import Column from "./pages/column/column";
import Qna from "./pages/qna/qna";
import MyPage from "./pages/mypage/mypage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Curation />} />
          <Route path="/balance-game" element={<BalanceGame />} />
          <Route path="/column" element={<Column />} />
          <Route path="/qna" element={<Qna />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
