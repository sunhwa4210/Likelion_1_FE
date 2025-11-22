
import React from "react";
import Header from "../../components/atoms/Header/header";
import Search from "../qna/components/QnaSearchBar";
import Filter from "../qna/components/qnafilter";
import Card from "./components/card";
import sytles from "./column.module.css";
import Pen from "./components/columnFabButton";
export default function Column() {
  return (
    <div className="app-wrapper">
      <div className={sytles.container}>
      <Header />
      <Search/>
      <Filter/>
      <Card/>
       <Card/>
        <Card/>
         <Card/>
         <Pen/>
         </div>
         </div> );
}
