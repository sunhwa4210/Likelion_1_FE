import back_arrow from './back_arrow.png';
import {useCallback} from 'react';
import './Header.css';

//props: title, onBack
//title: 헤더 가운데 제목 (문자열)
//onBack: 뒤로가기 헨들러  (없으면 기본은 뒤로가기) (커스텀 필요하면 props로 보내서 사용할 것)

export default function Header({title, onBack}) {
    const handleBack = useCallback(()=>{
        if (typeof onBack === 'function') onBack();
        else if (window.history.length>1) window.history.back();
        else window.location.href='/'; //진입 히스토리 없을 때 홈으로
    },[onBack]);

    return(
        <div className='header-wrapper'>
        <header className='app-header'>
            <button type='button' className='back-btn' onClick={handleBack} aria-label='뒤로가기'>
                <img className="back-icon" src={back_arrow} alt="뒤로가기"/>
            </button>

            <h1 className='header-title'>{title}</h1>
            <div className='back-btn'></div>

        </header>
        </div>
    )
}
