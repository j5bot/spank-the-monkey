import React, { AnimationEventHandler, FunctionComponent } from 'react';

export type MonkeyMotionState = 'adding' | 'removing' | 'sitting';
export type MonkeyActionParams = {
    action: MonkeyMotionState;
    cargo?: string;
};

type MonkeyProps = {
    height: number;
    action: MonkeyActionParams;
    onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
};

export const Monkey: FunctionComponent<MonkeyProps> = ({
    height,
    action: { action, cargo },
    onAnimationEnd,
}) => {
    const monkeyEmoji = '🐒';

    return (
            <div
                className={`monkey-perch monkey-perch--${action}`.trim()}
                style={{ '--monkey-height': height }}
                onAnimationEnd={onAnimationEnd}
            >
                <div
                    className={`monkey tower`}
                >
                    {monkeyEmoji}
                </div>
                <div className="cargo">{cargo}</div>
            </div>
    );
};
