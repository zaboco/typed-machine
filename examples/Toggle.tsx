import * as React from 'react';
import { Machine } from '../src/react/Machine';
import { Fsm, DefineTemplate } from '../src/Fsm';

type ToggleFsm = Fsm<ToggleState, ToggleTemplate>;

type ToggleState = 'Enabled' | 'Disabled';

type ToggleTemplate = DefineTemplate<
  ToggleState,
  {
    Enabled: {
      model: null;
      actionPayloads: {
        DISABLE: null;
        CLOSE: null;
      };
    };
    Disabled: {
      model: null;
      actionPayloads: {
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
          <button onClick={() => dispatch(['DISABLE'])}>Disable</button>
        </div>
      ),
      actionHandlers: {
        CLOSE: () => ['Disabled', null],
        DISABLE: () => ['Disabled', null],
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
      actionHandlers: {
        ENABLE: () => ['Enabled', null],
      },
    },
  },
};

export const Toggle = () => <Machine {...toggleFsm} />;
