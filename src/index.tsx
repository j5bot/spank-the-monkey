import React, { FunctionComponent, useEffect, useState } from "react";
import { render } from "react-dom";

import { Junk } from "./Junk";
import { Monkey } from "./Monkey";
import { junkToString, randomJunkAdjustments, stringToJunk } from "./helpers";

import "./styles.css";

const junkEmoji = [
  "📡",
  "⚙️",
  "🛢",
  "🧸",
  "🛁",
  "🗄",
  "🥡",
  "🧶",
  "🎲",
  "🚘",
  "🚎",
  "⛽️",
  "🛰",
  "🧱",
  "📦",
  "🧳",
  "🚽",
  "💣",
  "☎️",
  "📺",
];

const shuffle = (arr: string[]) => {
  arr.forEach((value: string, index: number, array: string[]) => {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], value];
  });
  return arr;
};

const App: FunctionComponent<{}> = () => {
  const [height, setHeight] = useState(
    parseInt((window.localStorage.getItem("height") ?? '11'), 10)
  );
  window.localStorage.setItem("height", height.toString());

  const enoughEmoji = junkEmoji.concat(junkEmoji);

  const [junk, setJunk] = useState([]);

  useEffect(() => {
    let junkItems: Array<{ value: string; size: number }>;
    const junkItemsString = window.localStorage.getItem("junkItems");
    if (junkItemsString) {
      junkItems = stringToJunk(junkItemsString);
    } else {
      junkItems = shuffle(enoughEmoji).map((emoji, index) => {
        const adjustments = randomJunkAdjustments(index);
        return { value: emoji, size: adjustments.size };
      });
      window.localStorage.setItem("junkItems", junkToString(junkItems));
    }
    setJunk(junkItems);
  }, []);

  const heightAdjust = 1 - Math.max(height - 18, 0) * 0.03;

  return (
    <div className="App">
      <div className="stack">
        <Monkey />
        <div
          className="pile"
          style={{
            fontSize: `${heightAdjust}em`,
          }}
        >
          {junk
            ?.slice(0, height)
            .reverse()
            .map((junkItem, index: number) => {
              return (
                <Junk
                  level={index}
                  item={junkItem.value}
                  size={junkItem.size}
                />
              );
            })}
        </div>
      </div>
      <div className="controls">
        <div className="display">{height}</div>
        <button
          className="plusButton"
          onClick={() => {
            setHeight(height + 1);
          }}
        >+</button>
        <button
          className="minusButton"
          onClick={() => {
            setHeight(height - 1);
          }}
        >-</button>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
