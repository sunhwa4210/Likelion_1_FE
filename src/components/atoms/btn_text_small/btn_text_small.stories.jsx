import BtnTextSmall from "./btn_text_small.jsx";

export default {
  title: "Atoms/BtnTextSmall",
  component: BtnTextSmall,
  args: {
    children: "텍스트",
    appearance: "txt_latest",
    disabled: false,
  },
  argTypes: {
    appearance: {
      control: { type: "radio" },
      options: [
        "txt_latest_active",
        "txt_latest",
        "txt_filter",
        "txt_reply",
        "txt_comment",
      ],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

/** 시안 1: ● 최신순(활성) */
export const LatestActive = {
  name: "● 최신순(활성)",
  args: { appearance: "txt_latest_active", children: "최신순" },
};

/** 시안 2: ○ 최신순(비활성) */
export const Latest = {
  name: "○ 최신순(비활성)",
  args: { appearance: "txt_latest", children: "최신순" },
};

/** 시안 3: 필터 */
export const Filter = {
  args: { appearance: "txt_filter", children: "필터" },
};

/** 시안 4: 답글달기 */
export const Reply = {
  args: { appearance: "txt_reply", children: "답글달기" },
};

/** 시안 5: 댓글 */
export const Comment = {
  args: { appearance: "txt_comment", children: "댓글" },
};
