import Button from "./btn_text.jsx";

export default {
  title: "Atoms/Button",
  component: Button,
  args: { children: "텍스트", fullWidth: true },
  argTypes: {
    appearance: { control: "radio", options: ["activated","default","stroke","login"] },
  },
};

export const Activated = { args: { appearance: "activated" } };
export const Default   = { args: { appearance: "default" } };
export const Stroke    = { args: { appearance: "stroke" } };
export const Login     = { args: { appearance: "login" } };

