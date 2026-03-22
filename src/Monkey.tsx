import React, { AnimationEventHandler, FunctionComponent } from 'react';

export type MonkeyMotionState = 'adding' | 'removing' | 'sitting';
export type MonkeyActionParams = {
    action: MonkeyMotionState;
    cargo?: string;
};

// Fraction of each step's time dedicated to the pause (0–1). Higher = longer pause.
const DEFAULT_STEP_PAUSE_FRACTION = 0.7;

/**
 * Generates a CSS `linear()` timing function that animates in discrete steps.
 * The output progresses from 0 → 1 in `steps` equal jumps. Within each step's
 * block, the jump to the next value happens quickly at the start, and the rest
 * of the block is a pause before the following step.
 */
const generateSteppedLinear = (steps: number, pauseFraction: number): string => {
    if (steps <= 0) return 'linear(0, 1)';

    const stops: string[] = ['0 0%'];

    for (let i = 0; i < steps; i++) {
        const blockEnd = ((i + 1) / steps) * 100;
        const moveEnd = (i / steps + (1 - pauseFraction) / steps) * 100;
        const endValue = (i + 1) / steps;

        stops.push(`${endValue.toFixed(4)} ${moveEnd.toFixed(4)}%`);
        stops.push(`${endValue.toFixed(4)} ${blockEnd.toFixed(4)}%`);
    }

    return `linear(${stops.join(', ')})`;
};

type MonkeyProps = {
    height: number;
    action: MonkeyActionParams;
    onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
    stepPauseFraction?: number;
};

export const Monkey: FunctionComponent<MonkeyProps> = ({
    height,
    action: { action, cargo },
    onAnimationEnd,
    stepPauseFraction = DEFAULT_STEP_PAUSE_FRACTION,
}) => {
    const monkeyEmoji = '🐒';
    const stepTiming = generateSteppedLinear(height, stepPauseFraction);

    return (
            <div
                className={`monkey-perch monkey-perch--${action}`.trim()}
                style={{ '--monkey-height': height, '--step-timing': stepTiming }}
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
