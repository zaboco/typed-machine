import { DefineTemplate, Fsm, renderCurrent } from './Fsm';
import { ActionShape, DeriveAction, Dispatch } from './types/Actions';

type ToggleFsm = Fsm<MachineMock<any>, ToggleState, ToggleTemplate>;

type ToggleState = 'Enabled' | 'Disabled';

type ToggleTemplate = DefineTemplate<
  ToggleState,
  {
    Enabled: {
      model: null;
      transitionPayloads: {
        DISABLE: null;
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

type MachineMock<A extends ActionShape> = Dispatch<A>;

type EnAction = DeriveAction<ToggleTemplate['Enabled']['transitionPayloads']>;
type DisAction = DeriveAction<ToggleTemplate['Disabled']['transitionPayloads']>;

export const toggleMockFsm: ToggleFsm = {
  current: 'Disabled',
  graph: {
    Enabled: {
      model: null,
      // <button onClick={() => dispatch('DISABLE')}>Disable</button>
      render: dispatch => dispatch,
      transitions: {
        DISABLE: () => ['Disabled', null],
      },
    },
    Disabled: {
      model: null,
      // <button onClick={() => dispatch('ENABLE')}>Enable</button>
      render: dispatch => dispatch,
      transitions: {
        ENABLE: () => ['Enabled', null],
      },
    },
  },
};

// export const MockToggle = () => ;
