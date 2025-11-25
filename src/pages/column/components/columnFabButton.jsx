import React from 'react';
import {Link} from 'react-router-dom'
import Pen from '../../qna/icon/pen-tool.svg'
import styles from '../columnWrite.module.css';
export default function columnFabButton (){

    return(
        <Link to="/columnwrite" className={styles.iconWrapper} >
            <img src={Pen} alt="펜"/>
        </Link>
    )

}