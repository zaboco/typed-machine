import * as React from 'react';
import { Machine } from '../src/react/Machine';
import { Action, action } from '../src/types/Actions';
import { Fsm, DefineTemplate } from '../src/Fsm';

type ToggleFsm = Fsm<ToggleState, ToggleTemplate>;

type ToggleState = 'Enabled' | 'Disabled';

type ToggleTemplate = DefineTemplate<
  ToggleState,
  {
    Enabled: {
      model: null;
      action: Action<'DISABLE'> | Action<'CLOSE'>;
    };
    Disabled: {
      model: null;
      action: Action<'ENABLE'>;
    };
  }
>;

const toggleFsm: ToggleFsm = {
  current: 'Disabled',
  graph: {
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
  },
};

export const Toggle = () => <Machine {...toggleFsm} />;
