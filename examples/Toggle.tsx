import * as React from 'react';
import { Machine } from '../src/react/Machine';
import { Action } from '../src/types/Actions';
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
          <button onClick={() => dispatch(['DISABLE'])}>Disable</button>
        </div>
      ),
      transition: action => {
        switch (action[0]) {
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
          <button onClick={() => dispatch(['ENABLE'])}>Enable</button>
        </div>
      ),
      transition: action => {
        switch (action[0]) {
          case 'ENABLE':
            return ['Enabled', null];
        }
      },
    },
  },
};

export const Toggle = () => <Machine {...toggleFsm} />;
