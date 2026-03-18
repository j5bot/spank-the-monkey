import React, { AnimationEventHandler, FunctionComponent } from "react";

type MonkeyProps = {
  motionState: "left" | "moving-right" | "moving-down" | "down";
  dropClass?: string;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
};

export const Monkey: FunctionComponent<MonkeyProps> = ({
  motionState,
  dropClass,
  onAnimationEnd,
}) => {
  const monkeyEmoji = "🐒";

  return (
    <div
      className={`monkey tower monkey--${motionState} ${dropClass ?? ""}`.trim()}
      onAnimationEnd={onAnimationEnd}
    >
      {monkeyEmoji}
    </div>
  );
};
