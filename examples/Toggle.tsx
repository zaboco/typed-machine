import * as React from 'react';
import { Machine, ReactFsm } from '../src/react/Machine';
import { DefineTemplate } from '../src/Fsm';

type ToggleFsm = ReactFsm<ToggleState, ToggleTemplate>;

type ToggleState = 'Enabled' | 'Disabled';

type ToggleTemplate = DefineTemplate<
  ToggleState,
  {
    Enabled: {
      model: null;
      transitionPayloads: {
        DISABLE: null;
        CLOSE: null;
      };
    };
    Disabled: {
      model: null;
      transitionPayloads: {
        ENABLE: null;
      };
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
          <button onClick={() => dispatch('DISABLE')}>Disable</button>
        </div>
      ),
      transitions: {
        CLOSE: () => ['Disabled', null],
        DISABLE: () => ['Disabled', null],
      },
    },
    Disabled: {
      model: null,
      render: dispatch => (
        <div>
          Disabled
          <button onClick={() => dispatch('ENABLE')}>Enable</button>
        </div>
      ),
      transitions: {
        ENABLE: () => ['Enabled', null],
      },
    },
  },
};

export const Toggle = () => <Machine {...toggleFsm} />;
