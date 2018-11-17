import { RenderResult, fireEvent } from 'react-testing-library';

type Step = (rr: RenderResult) => RenderResult;

// === Standard Steps ===
export const click = (buttonLabel: string) =>
  step(({ getByText }) => {
    fireEvent.click(getByText(buttonLabel));
  });

export const inputHandlerByValue = (currentValue: string) => (newValue: string) =>
  step(({ getByValue }) => {
    fireEvent.change(getByValue(currentValue), { target: { value: newValue } });
  });

// === Constructor ===
export function step(step: (rr: RenderResult) => void): Step {
  return renderResult => {
    step(renderResult);
    return renderResult;
  };
}

// === Runner ===
export function runSteps(initial: RenderResult, steps: Step[]): RenderResult {
  return composeSteps(steps)(initial);
}

export function composeSteps(steps: Step[]): Step {
  return renderResult => steps.reduce((result, step) => step(result), renderResult);
}
