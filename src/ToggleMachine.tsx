import * as React from 'react';
import { Fsm, Machine, Graph } from './Machine';
import { Action, action } from './Actions';

type ToggleGraph = Graph<ToggleState, ToggleActionMap>;

type ToggleState = 'Enabled' | 'Disabled';

type ToggleActionMap = {
  Enabled: Action<'DISABLE'> | Action<'CLOSE'>;
  Disabled: Action<'ENABLE'>;
};

const toggleGraph: ToggleGraph = {
  Enabled: {
    render: dispatch => (
      <div>
        Enabled
        <button onClick={() => dispatch(action('DISABLE'))}>Disable</button>
      </div>
    ),
    transition: action => {
      switch (action.type) {
        case 'DISABLE':
          return 'Disabled';
        case 'CLOSE':
          return 'Disabled';
      }
    },
  },
  Disabled: {
    render: dispatch => (
      <div>
        Disabled
        <button onClick={() => dispatch(action('ENABLE'))}>Enable</button>
      </div>
    ),
    transition: action => {
      switch (action.type) {
        case 'ENABLE':
          return 'Enabled';
      }
    },
  },
};

export const ToggleMachine = ({ initial = 'Enabled' }: { initial?: ToggleState }) => (
  <Machine current={initial} graph={toggleGraph} />
);
