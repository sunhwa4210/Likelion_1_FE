import React from 'react';
import "../../index.css"
import Globalheader from '../../components/atoms/Header/header';
import Header from "../../components/Header/Header";
export default function columnRead(){

return(
    <div className="app-wrapper" >
        <Globalheader></Globalheader>
        <Header title={"칼럼 읽기"}></Header>
    </div>
)
}