import React, { FunctionComponent } from "react";

export const Monkey: FunctionComponent<{}> = props => {
  const monkeyEmoji = "🐵";
  return <div className="monkey tower">{monkeyEmoji}</div>;
};
