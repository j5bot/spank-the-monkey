import React, { FunctionComponent } from "react";
import { randomInt } from "./helpers";

export const Junk: FunctionComponent<{
  level: number;
  item?: string;
  items?: string[];
  skew?: number;
  shift?: number;
  size?: number;
}> = (props) => {
  const { level, item, items, shift, size, skew } = props;
  const computedSkew = skew ?? level === 1 ? 0 : randomInt(-30, 30);
  const computedShift = shift ?? level === 1 ? 0 : randomInt(-3, 3);
  const computedSize = size ?? randomInt(90, 120) / 100;

  const randomJunk = item
    ? item
    : items && items[randomInt(0, items.length - 1)];
  return (
    <div
      className="junk tower"
      style={{
        zIndex: level,
        transform: `rotate(${computedSkew}deg) scale(${computedSize})`,
        position: "relative",
        left: `${computedShift}px`,
      }}
    >
      {randomJunk}
    </div>
  );
};
