import * as React from 'react';
import { Machine, Graph } from '../src/Machine';
import { Action, action } from '../src/Actions';

type ToggleGraph = Graph<ToggleState, ToggleActionMap>;

type ToggleState = 'Enabled' | 'Disabled';

type ToggleActionMap = {
  Enabled: Action<'DISABLE'> | Action<'CLOSE'>;
  Disabled: Action<'ENABLE'>;
};

const toggleGraph: ToggleGraph = {
  Enabled: {
    model: null,
    render: dispatch => (
      <div>
        Enabled
        <button onClick={() => dispatch(action('DISABLE'))}>Disable</button>
      </div>
    ),
    transition: action => {
      switch (action.type) {
        case 'DISABLE':
          return ['Disabled', null];
        case 'CLOSE':
          return ['Disabled', null];
      }
    },
  },
  Disabled: {
    model: null,
    render: dispatch => (
      <div>
        Disabled
        <button onClick={() => dispatch(action('ENABLE'))}>Enable</button>
      </div>
    ),
    transition: action => {
      switch (action.type) {
        case 'ENABLE':
          return ['Enabled', null];
      }
    },
  },
};

export const ToggleMachine = ({ initial = 'Enabled' }: { initial?: ToggleState }) => (
  <Machine current={initial} graph={toggleGraph} />
);
