import BtnModal from "./btn_modal";

export default {
  title: "Atoms/BtnModal",
  component: BtnModal,
  args: { children: "텍스트", fullWidth: true },
  argTypes: {
    appearance: { control: "radio", options: ["active","unactive"] },
  },
};

export const Activate = { args: { appearance: "active" } };
export const Unactive   = { args: { appearance: "unactive" } };

