import { RenderResult, fireEvent } from 'react-testing-library';

type Interaction = (rr: RenderResult) => RenderResult;

// === Standard Interactions ===
export const click = (buttonLabel: string) =>
  interaction(({ getByText }) => {
    fireEvent.click(getByText(buttonLabel));
  });

export const inputHandlerByValue = (currentValue: string) => (newValue: string) =>
  interaction(({ getByValue }) => {
    fireEvent.change(getByValue(currentValue), { target: { value: newValue } });
  });

// === Constructor ===
export function interaction(sideEffect: (rr: RenderResult) => void): Interaction {
  return renderResult => {
    sideEffect(renderResult);
    return renderResult;
  };
}

// === Runner ===
export function runInteractions(initial: RenderResult, actions: Interaction[]): RenderResult {
  return composeInteractions(actions)(initial);
}

export function composeInteractions(actions: Interaction[]): Interaction {
  return renderResult => actions.reduce((result, action) => action(result), renderResult);
}
