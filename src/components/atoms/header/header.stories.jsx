import React from "react";
import Header from "./header";

export default {
  title: "Organisms/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = {
  render: () => <Header />,
};
