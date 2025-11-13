// 모달 컴포넌트 테스트를 위한 임시 페이지입니다. 


import { useNavigate } from 'react-router-dom';
import { useModal } from '../components/Modal/ModalProvider'; 
import { presets } from '../components/Modal/presets';
import Header from '../components/Header/Header';
import CurationFilter from '../components/Filter/CurationFilter';
import CategoryFilter from '../components/Filter/CategoryFilter';

export default function SomePage() {
  const { open } = useModal();
  const nav = useNavigate();

  const onHeaderBack = async () => {
    const res = await open(presets.exitOrContinue());
    if (res === 'exit') nav('/onboarding');           // 그만두기
    // 'stay'면 아무 것도 안 함
  };

  const onSelectChoice = async () => {
    const res = await open(presets.likeOrStay('관련 큐레이션으로 이동할게요'));
    if (res === 'ok') nav('/curation/related');
  };

  const onQuizCorrect = async () => {
    const res = await open(presets.quizCorrect());
    if (res === 'ok') nav('/curation/related');
  };

  const onQuizWrongTwice = async () => {
    await open(presets.quizRetry()); // 확인만
  };

  const onBackFromCuration = async () => {
    const res = await open(presets.backFromCuration());
    if (res === 'to-balance') nav('/balance');
    else if (res === 'to-other-curation') nav('/curation/other');
  };

  const onDeleteArticle = async () => {
    const res = await open(presets.confirmDelete('칼럼'));
    if (res === 'delete') {
      // 삭제 API 호출 후 처리
    }
  };

  const onLogout = async () => {
    const res = await open(presets.logout());
    if (res === 'logout') {
      // 로그아웃 실행
    }
  };

  const onUnfollow = async () => {
    const res = await open(presets.confirmUnfollow());
    if (res === 'delete') {
      // 언팔로우 처리
    }
  };

  return (
    <div className='app-wrapper'>
        <Header title="모달 테스트 페이지"/>

      {/* 버튼들은 예시 */}
      <button onClick={onHeaderBack}>뒤로가기(모달)</button>
      <button onClick={onSelectChoice}>선택지 클릭(모달)</button>
      <button onClick={onQuizCorrect}>정답(모달)</button>
      <button onClick={onQuizWrongTwice}>두 번 오답(모달)</button>
      <button onClick={onBackFromCuration}>큐레이션에서 이전(모달)</button>
      <button onClick={onDeleteArticle}>칼럼 삭제(모달)</button>
      <button onClick={onLogout}>로그아웃(모달)</button>
      <button onClick={onUnfollow}>팔로우 취소(모달)</button>
      <CategoryFilter/> 
      <CategoryFilter variant='specialty'/>
      <CurationFilter/>

    </div>
  );
}
