import React, { AnimationEvent, FunctionComponent, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { CompatibleDie } from './CompatibleDie';
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

const shuffle = <T,>(arr: T[]) => {
    arr.forEach((value: T, index: number, array: T[]) => {
        const randomIndex = Math.floor(Math.random() * (
                index + 1
        ));
        [array[index], array[randomIndex]] = [array[randomIndex], value];
    });
    return arr;
};

type JunkItem = {
    value: string;
    size: number;
};

type MonkeyMotionState = 'left' | 'moving-right' | 'moving-down' | 'down';

const App: FunctionComponent<{}> = () => {
    const [height, setHeight] = useState(
            parseInt((
                    window.localStorage.getItem('height') ?? '11'
            ), 10)
    );

    const [junk, setJunk] = useState<JunkItem[]>([]);
    const [monkeyMotionState, setMonkeyMotionState] = useState<MonkeyMotionState>('left');

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

    useEffect(() => {
        window.localStorage.setItem('height', height.toString());
    }, [height]);

    const increaseHeight = () => {
        setHeight((currentHeight) => currentHeight + 1);
        setMonkeyMotionState('moving-right');
    };

    const decreaseHeight = () => {
        setHeight((currentHeight) => currentHeight - 1);
    };

    const handleMonkeyAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
        if (monkeyMotionState === 'moving-right' && event.animationName === 'monkey-move-right') {
            setMonkeyMotionState('moving-down');
            return;
        }

        if (monkeyMotionState === 'moving-down' && event.animationName === 'monkey-move-down') {
            setMonkeyMotionState('down');
        }
    };

    const pileDensityClass = height > 30
            ? 'pile--tightest'
            : height > 24
                    ? 'pile--tighter'
                    : height > 18
                            ? 'pile--tight'
                            : '';

    const monkeyDropClass = height > 30
            ? 'monkey-drop--extreme'
            : height > 24
                    ? 'monkey-drop--high'
                    : height > 18
                            ? 'monkey-drop--mid'
                            : 'monkey-drop--low';

    return (
            <div className="App">
                <div className="logo"><Logo /></div>
                <div className="die">
                    <CompatibleDie rollDone={() => false}
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
                                onClick={increaseHeight}
                        >+
                        </button>
                        <button
                                className="minusButton"
                                onClick={decreaseHeight}
                        >-
                        </button>
                        <button
                                className="reset"
                                onClick={reset}
                        >↺
                        </button>
                    </div>
                    <div className="stack">
                        <Monkey
                                motionState={monkeyMotionState}
                                dropClass={monkeyDropClass}
                                onAnimationEnd={handleMonkeyAnimationEnd}
                        />
                        <div className={`pile ${pileDensityClass}`.trim()}>
                            {junk
                                    ?.slice(0, height)
                                    .reverse()
                                    .map((junkItem, index: number) => {
                                        return (
                                                <Junk
                                                        key={`${junkItem.value}-${index}`}
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
if (rootElement) {
    createRoot(rootElement).render(<App />);
}
