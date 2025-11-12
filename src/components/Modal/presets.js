//각각의 컴포넌트 사용 상황에 맞는 카피-버튼으로 매핑
export const presets = {
  //로그인-회원가입에서 헤더 뒤로가기: “그만두기/계속하기”
  exitOrContinue: () => ({
    title: '',
    message: '그만두시겠어요?',
    buttons: [
      { label: '그만두기', value: 'exit',    tone:'neutral' },
      { label: '계속하기', value: 'stay',    tone:'primary', autoFocus:true },
    ],
  }),

  // 밸런스/선호도 선택 후: “괜찮아요/좋아요 → 관련 큐레이션”
  likeOrStay: (msg='관련 큐레이션으로 이동할게요') => ({
    title: '',
    message: msg,
    buttons: [
      { label: '괜찮아요', value: 'cancel', tone:'neutral' },
      { label: '좋아요',   value: 'ok',     tone:'primary', autoFocus:true },
    ],
  }),

  // OX 정답일 때
  quizCorrect: () => ({
    title: '정답입니다!',
    message: '관련 큐레이션으로 이동할게요',
    buttons: [
      { label: '괜찮아요', value: 'cancel', tone:'neutral' },
      { label: '좋아요',   value: 'ok',     tone:'primary', autoFocus:true },
    ],
  }),

  // OX 두 번 오답
  quizRetry: () => ({
    title: '정답은 O 입니다',
    message: '관련 큐레이션으로 이동할게요',
    buttons: [
      { label: '괜찮아요', value: 'cancel', tone:'neutral' },
      { label: '좋아요',   value: 'ok',     tone:'primary', autoFocus:true },    ],
  }),

  // 퀴즈로 이동한 큐레이션에서 이전: “괜찮아요(밸런스 게임 화면 으로)/좋아요(다른 큐레이션)”
  backFromCuration: () => ({
    title: '',
    message: '다른 선택지의 큐레이션도\n읽어보시겠어요?',
    buttons: [
      { label: '괜찮아요', value: 'to-balance', tone:'neutral' },
      { label: '좋아요',   value: 'to-other-curation', tone:'primary', autoFocus:true },
    ],
  }),

  // 칼럼/댓글삭제
  confirmDelete: (what='항목') => ({
    title: '',
    message: `${what}을 삭제할까요?`,
    variant: 'danger',
    buttons: [
      { label: '취소', value: 'cancel', tone:'neutral', autoFocus:true },
      { label: '삭제', value: 'delete', tone:'danger' },
    ],
  }),

 // 스크랩 삭제
  scrapDelete: () => ({
    title: '',
    message: `스크랩에서 삭제하시겠어요?`,
    variant: 'danger',
    buttons: [
      { label: '취소', value: 'cancel', tone:'neutral', autoFocus:true },
      { label: '삭제', value: 'delete', tone:'danger' },
    ],
  }),

  // 로그아웃
  logout: () => ({
    title: '',
    message: `로그아웃 할까요?`,
    variant: 'danger',
    buttons: [
      { label: '취소',   value: 'cancel', tone:'neutral', autoFocus:true },
      { label: '로그아웃', value: 'logout', tone:'danger' },
    ],
  }),

  // 팔로잉 ‘취소’ → 팔로우/팔로잉 삭제
  confirmUnfollow: () => ({
    title: '',
    message: '팔로잉 목록에서 삭제할까요?',
    variant:'danger',
    buttons: [
      { label: '취소', value: 'cancel', tone:'neutral', autoFocus:true },
      { label: '삭제', value: 'delete', tone:'danger' },
    ],
  }),
};
