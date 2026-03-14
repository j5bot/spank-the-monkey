import React, { FunctionComponent, useEffect, useState } from "react";
import { render } from "react-dom";
import { Button } from "@blueprintjs/core";
import ReactDice from "react-dice-complete";

import { Junk } from "./Junk";
import { Monkey } from "./Monkey";
import { junkToString, randomJunkAdjustments, stringToJunk } from "./helpers";

import "@blueprintjs/core/lib/css/blueprint.css";
import "react-dice-complete/dist/react-dice-complete.css";
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
    parseInt(window.localStorage.getItem("height"), 10) ?? 11
  );
  window.localStorage.setItem("height", height.toString());

  const enoughEmoji = junkEmoji.concat(junkEmoji);

  const [junk, setJunk] = useState();

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

  const heightAdjust = 1 - Math.max(height - 11, 0) * 0.03;

  console.log(heightAdjust);

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
            .map((junkItem: string, index: number) => {
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
        <ReactDice
          className="die"
          numDice={1}
          faceColor="brown"
          dotColor="yellow"
        />
        <div className="display">{height}</div>
        <Button
          icon={"plus"}
          className="plusButton"
          large={true}
          onClick={() => {
            setHeight(height + 1);
          }}
        />
        <Button
          icon={"minus"}
          className="minusButton"
          large={true}
          onClick={() => {
            setHeight(height - 1);
          }}
        />
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
