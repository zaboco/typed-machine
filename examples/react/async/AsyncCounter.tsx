import * as React from 'react';
import { MachineContainer } from '../../../src/react';
import {
  asyncCounterMachine,
  AsyncCounterMsg,
  AsyncCounterState,
  AsyncCounterTemplate,
} from './AsyncCounterMachine';

export const AsyncCounter = () => {
  return (
    <MachineContainer<AsyncCounterState, AsyncCounterTemplate>
      machine={asyncCounterMachine}
      views={{
        Readonly: (dispatch, value) => (
          <div>
            <span>{value}</span>{' '}
            <button onClick={() => dispatch(AsyncCounterMsg.START_EDITING)}>Edit</button>
          </div>
        ),
        Editable: (dispatch, value) => (
          <div>
            <span>{value}</span>{' '}
            <button onClick={() => dispatch(AsyncCounterMsg.REQUEST_INCREMENT)}>+</button>{' '}
            <button onClick={() => dispatch(AsyncCounterMsg.SAVE)}>Save</button>
          </div>
        ),
        Loading: (dispatch, value) => (
          <div>
            <span>{value}</span> <span>Loading...</span>{' '}
            <button onClick={() => dispatch(AsyncCounterMsg.CANCEL_REQUEST)}>Cancel</button>{' '}
            <button onClick={() => dispatch(AsyncCounterMsg.INCREMENT_SUCCESS, value + 1)}>
              Perform increment
            </button>
          </div>
        ),
      }}
    />
  );
};
