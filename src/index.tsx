import React, { FunctionComponent, useEffect, useState } from 'react';
import Die from 'react-dice-complete';
import { render } from 'react-dom';

import { Junk } from './Junk';
import { Monkey } from './Monkey';
import { junkToString, randomJunkAdjustments, stringToJunk } from './helpers';
// @ts-ignore need to set up eslint
import Logo from './logo.svg?react';

import './styles.css';

const junkEmoji = [
    '📡',
    '⚙️',
    '🛢',
    '🧸',
    '🤖',
    '🦾',
    '🪨',
    '🏚️',
    '🎲',
    '🚘',
    '🚎',
    '⛽️',
    '🎃',
    '🏆',
    '📦',
    '🧳',
    '🚽',
    '💣',
    '☎️',
    '📺',
    '🧰',
    '🪜',
    // '⚰️',
    '🪦',
    '👑',
    '📻',
    '🔋',
    '🗑️',
    '🕰️',
    '🗿',
   // '🛝',
    '🎡',
    // '⛲',
    '🎠',
    '🛹',
    // '🛷',
    '🪩',
    '🛞',
    '🚀',
    // '🛸',
    '🎀',
];

const shuffle = (arr: string[]) => {
    arr.forEach((value: string, index: number, array: string[]) => {
        const randomIndex = Math.floor(Math.random() * (
                index + 1
        ));
        [array[index], array[randomIndex]] = [array[randomIndex], value];
    });
    return arr;
};

const App: FunctionComponent<{}> = () => {
    const [height, setHeight] = useState(
            parseInt((
                    window.localStorage.getItem('height') ?? '11'
            ), 10)
    );
    window.localStorage.setItem('height', height.toString());

    const [junk, setJunk] = useState([]);

    const reset = () => {
        const junkItems = shuffle(junkEmoji).map((emoji, index) => {
            const adjustments = randomJunkAdjustments(index);
            return { value: emoji, size: adjustments.size };
        });
        window.localStorage.setItem('junkItems', junkToString(junkItems));
        setJunk(junkItems);
    };

    const recycle = () => {
        const used = junk.slice(0, height - 1);
        const unused = shuffle(junk.slice(height - 1));
        let junkItems = used.concat(unused);
        if (height === junkItems.length) {
            junkItems = junkItems.concat(junkItems);
        }
        window.localStorage.setItem('junkItems', junkToString(junkItems));
        setJunk(junkItems);
    };

    useEffect(() => {
        const junkItemsString = window.localStorage.getItem('junkItems');
        if (junkItemsString) {
            const junkItems = stringToJunk(junkItemsString);
            setJunk(junkItems);
        } else {
            reset();
        }
    }, []);

    useEffect(() => {
        if (height === 0 || junk.length === 0) {
            return;
        }
        recycle();
    }, [height]);

    const heightAdjust = 1 - Math.max(height - 18, 0) * 0.03;

    return (
            <div className="App">
                <div className="logo"><Logo /></div>
                <div className="die">
                    <Die rollDone={() => false}
                         numDice={1}
                         faceColor="brown"
                         dotColor="yellow"
                    />
                </div>
                <div className="container">
                    <div className="controls">
                        <div className="display">{height}</div>
                        <button
                                className="plusButton"
                                onClick={() => {
                                    setHeight(height + 1);
                                }}
                        >+
                        </button>
                        <button
                                className="minusButton"
                                onClick={() => {
                                    setHeight(height - 1);
                                }}
                        >-
                        </button>
                        <button
                                className="reset"
                                onClick={reset}
                        >↺
                        </button>
                    </div>
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
                </div>
            </div>
    );
};

const rootElement = document.getElementById('root');
render(<App />, rootElement);
