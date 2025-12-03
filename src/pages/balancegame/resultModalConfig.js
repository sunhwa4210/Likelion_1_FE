// 어떤 타입의 결과 모달이 있는지
export const RESULT_TYPES = {
  CORRECT: "correct",
  WRONG: "wrong",
  OTHER_CURATION: "otherCuration",
};

// 각 타입별로 ModalProvider.open()에 넘길 config
export const BALANCE_RESULT_MODAL_CONFIG = {
  [RESULT_TYPES.CORRECT]: {
    title: "정답입니다!",
    message: "관련 큐레이션으로 이동할게요",
    variant: "primary",
    buttons: [
      {
        label: "괜찮아요",
        value: "cancel",
        tone: "neutral",
      },
      {
        label: "좋아요",
        value: "confirm",
        tone: "primary",
        autoFocus: true,
      },
    ],
  },

  [RESULT_TYPES.WRONG]: {
    title: "다시 생각해볼까요?",
    variant: "neutral",
  },

  [RESULT_TYPES.OTHER_CURATION]: {
    title: "다른 선택의 큐레이션도 읽어보실래요?",
    message: "두 선택의 관점을 모두 보면 더 재미있어요.",
    variant: "primary",
    buttons: [
      {
        label: "괜찮아요",
        value: "cancel",
        tone: "neutral",
      },
      {
        label: "좋아요",
        value: "confirm",
        tone: "primary",
        autoFocus: true,
      },
    ],
  },
};
