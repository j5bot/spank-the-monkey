import React, { Component, FunctionComponent, ReactNode } from 'react';
import Die from 'react-dice-complete';

type CompatibleDieProps = {
  rollDone: () => boolean;
  numDice: number;
  faceColor: string;
  dotColor: string;
};

type DiceBoundaryProps = {
  children: ReactNode;
};

type DiceBoundaryState = {
  hasError: boolean;
};

class DiceErrorBoundary extends Component<DiceBoundaryProps, DiceBoundaryState> {
  state: DiceBoundaryState = { hasError: false };

  static getDerivedStateFromError(): DiceBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep a breadcrumb for diagnosing library compatibility in production.
    // eslint-disable-next-line no-console
    console.error('react-dice-complete crashed; rendering fallback die.', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dieFallback" role="img" aria-label="dice fallback">
          <span className="dieFallbackFace">🎲</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export const CompatibleDie: FunctionComponent<CompatibleDieProps> = (props) => {
  return (
    <DiceErrorBoundary>
      <Die {...props} />
    </DiceErrorBoundary>
  );
};

