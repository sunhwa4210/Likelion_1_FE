// Mypage.js
import React, {useState, useEffect} from "react";
import Header from "../../../../components/Header/Header";
import GlobalHeader from "../../../../components/Header/GlobalHeader";
import ScrapCuration from "./ScrapCuration";

export default function Scrap() {
    return (
        <div className="app-wrapper">
            <GlobalHeader/>
            <Header title="스크랩한 큐레이션" />
            <main className="content">
                <ScrapCuration />
            </main>
        </div>
    );
}
