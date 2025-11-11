import BtnI from "./btn_I";

export default {
  title: "Atoms/BtnI",
  component: BtnI,
  args: {
    children: "텍스트",
    fullWidth: true
  },
  argTypes: {
    appearence: {
        control: "radio",
        options:["default","selected","round_selected","round_default"]
    }
  }
};


export const Default = { args: {
  appearance: "default",
  appearence: "selected"
} };
export const Selected   = { args: { appearance: "selected" } };
export const Round_Selected   = { args: { appearance: "round_selected" } };
export const Round_Default     = { args: {
  appearance: "round_default",
  appearence: "selected"
} };