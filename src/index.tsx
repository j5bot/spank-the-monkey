import React, { AnimationEvent, FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { CompatibleDie } from './CompatibleDie';
import { Junk } from './Junk';
import { Monkey, MonkeyActionParams } from './Monkey';
import { junkToString, randomJunkAdjustments, stringToJunk } from './helpers';
// @ts-ignore need to set up eslint
import Logo from './logo.svg?react';

import './styles.scss';

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

const App: FunctionComponent<{}> = () => {
    const [height, setHeight] = useState(
            parseInt((
                    window.localStorage.getItem('height') ?? '11'
            ), 10)
    );

    const [junk, setJunk] = useState<JunkItem[]>([]);
    const [monkeyAction, setMonkeyAction] = useState<MonkeyActionParams>({ action: 'sitting' });

    const reset = () => {
        const junkItems = shuffle(junkEmoji).map((emoji, index) => {
            const adjustments = randomJunkAdjustments(index);
            return { value: emoji, size: adjustments.size };
        });
        window.localStorage.setItem('junkItems', junkToString(junkItems));
        setJunk(junkItems);
    };

    const makeCargo = (height: number) => junk.slice(height - 1, height)[0];

    const recycle = (height: number) => {
        const used = junk.slice(0, height);
        const unused = shuffle(junk.slice(height));
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
        window.localStorage.setItem('height', height.toString());
    }, [height]);

    const increaseHeight = () => {
        setMonkeyAction({ action: 'adding', cargo: makeCargo(height + 1).value });
    };

    const decreaseHeight = () => {
        const newHeight = height - 1;
        setMonkeyAction({ action: 'removing', cargo: makeCargo(height).value });
        recycle(height - 1);
        setHeight(newHeight);
    };

    const handleMonkeyAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
        if (event.animationName !== 'monkey-move') {
            return;
        }
        switch (monkeyAction.action) {
            case 'adding':
                setHeight(height + 1);
                recycle(height + 1);
                break;
            case 'removing':
                break;
            default:
                return;
        }
        setMonkeyAction({ action: 'sitting', cargo: undefined });
    };

    const pileDensityClass = height > 30
            ? 'pile--tightest'
            : height > 24
                    ? 'pile--tighter'
                    : height > 18
                            ? 'pile--tight'
                            : '';

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
                    <div className={`stack ${pileDensityClass}`.trim()}>
                        <Monkey
                                height={height}
                                action={monkeyAction}
                                onAnimationEnd={handleMonkeyAnimationEnd}
                        />
                        <div className={`pile`}>
                            {junk
                                    ?.slice(0, height)
                                    .reduce((acc: ReactNode[], junkItem, index: number) => {
                                        acc.push(
                                                <Junk
                                                        key={`${junkItem.value}-${index}`}
                                                        level={index}
                                                        item={junkItem.value}
                                                        size={junkItem.size}
                                                />
                                        );
                                        return acc;
                                    }, [])}
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
