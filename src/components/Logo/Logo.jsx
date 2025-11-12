import crossxnote from './crossxnote.png';
import './Logo.css';
//import Gnb from '.../Gnb/Gnb';  : 선화님담당 컴포넌트 Gnb(메뉴 아코디언)연결 예정

// className: 1.LoginLogo 2. GnbLogo

export default function Logo({ className }) {
  return (
    <img className={className} src={crossxnote} alt="로고"></img>
  );
}
