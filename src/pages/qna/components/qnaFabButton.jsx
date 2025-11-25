import React from 'react';
import {Link} from 'react-router-dom'
import Pen from '../icon/pen-tool.svg'
import styles from '../qna.module.css'
export default function qnaFabButton (){

    return(
        <Link to="/qnawrite" className={styles.iconWrapper} >
            <img src={Pen} alt="펜"/>
        </Link>
    )

}