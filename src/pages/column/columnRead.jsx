import React from 'react';
import "../../index.css"
import GlobalHeader from '../../components/atoms/header/GlobalHeader';
import Header from "../../components/Header/Header";
export default function columnRead(){

return(
    <div className="app-wrapper" >
        <GlobalHeader/>
        <Header title={"칼럼 읽기"}/>
    </div>
)
}