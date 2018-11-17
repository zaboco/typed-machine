import { RenderResult } from 'react-testing-library';

type Interaction = (rr: RenderResult) => RenderResult;

export function interaction(sideEffect: (rr: RenderResult) => void): Interaction {
  return renderResult => {
    sideEffect(renderResult);
    return renderResult;
  };
}

export function applyInteractions(initial: RenderResult, actions: Interaction[]): RenderResult {
  return composeInteractions(actions)(initial);
}

export function composeInteractions(actions: Interaction[]): Interaction {
  return renderResult => actions.reduce((result, action) => action(result), renderResult);
}
