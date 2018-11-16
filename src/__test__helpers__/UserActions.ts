import { RenderResult } from 'react-testing-library';

type UserAction = (rr: RenderResult) => RenderResult;

export function makeAction(action: (rr: RenderResult) => void): UserAction {
  return renderResult => {
    action(renderResult);
    return renderResult;
  };
}

export function applyActions(initial: RenderResult, actions: UserAction[]): RenderResult {
  return composeActions(actions)(initial);
}

export function composeActions(actions: UserAction[]): UserAction {
  return renderResult => actions.reduce((result, action) => action(result), renderResult);
}
