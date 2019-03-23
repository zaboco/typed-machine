import { DefineTemplate, Machine } from '../../../src/core/Machine';

export type AsyncCounterState = 'Readonly' | 'Editable' | 'Loading';

export enum AsyncCounterMsg {
  START_EDITING = 'START_EDITING',
  SAVE = 'SAVE',
  REQUEST_INCREMENT = 'REQUEST_INCREMENT',
  CANCEL_REQUEST = 'CANCEL_REQUEST',
  INCREMENT_SUCCESS = 'INCREMENT_SUCCESS',
}

export type AsyncCounterTemplate = DefineTemplate<
  AsyncCounterState,
  {
    Readonly: {
      model: number;
      transitionPayloads: {
        [AsyncCounterMsg.START_EDITING]: null;
      };
    };
    Editable: {
      model: number;
      transitionPayloads: {
        [AsyncCounterMsg.REQUEST_INCREMENT]: null;
        [AsyncCounterMsg.SAVE]: null;
      };
    };
    Loading: {
      model: number;
      transitionPayloads: {
        [AsyncCounterMsg.CANCEL_REQUEST]: null;
        [AsyncCounterMsg.INCREMENT_SUCCESS]: number;
      };
    };
  }
>;

export type AsyncCounterMachine = Machine<AsyncCounterState, AsyncCounterTemplate>;

export const asyncCounterMachine: AsyncCounterMachine = {
  current: 'Readonly',
  graph: {
    Readonly: {
      model: 0,
      transitions: {
        START_EDITING: value => ['Editable', value],
      },
    },
    Editable: {
      model: 0,
      transitions: {
        SAVE: value => ['Readonly', value],
        REQUEST_INCREMENT: value => ['Loading', value],
      },
      asyncTransitions: {
        SAVE: value => ({
          state: 'Readonly',
          model: value,
        }),
        REQUEST_INCREMENT: value => ({
          state: 'Loading',
          model: value,
          next: {
            thunk: () => requestIncrement(value, 2000),
            onSucces: AsyncCounterMsg.INCREMENT_SUCCESS,
          },
        }),
      },
    },
    Loading: {
      model: 0,
      transitions: {
        CANCEL_REQUEST: value => ['Editable', value],
        INCREMENT_SUCCESS: (_oldValue, newValue) => ['Editable', newValue],
      },
    },
  },
};

function requestIncrement(value: number, timeout = 1000): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value + 1);
    }, timeout);
  });
}
