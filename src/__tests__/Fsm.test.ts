import { DefineTemplate, Fsm, renderCurrent } from '../Fsm';
import { DeriveAction, Dispatch } from '../types/Actions';

type TestFsm = Fsm<TestDispatch, TestState, TestTemplate>;

type TestState = 'StateB' | 'StateA';

type TestDispatch = Dispatch<ActionA> | Dispatch<ActionB>;
type TestAction = ActionA | ActionB;
type ActionA = DeriveAction<TestTemplate['StateB']['transitionPayloads']>;
type ActionB = DeriveAction<TestTemplate['StateA']['transitionPayloads']>;

type TestTemplate = DefineTemplate<
  TestState,
  {
    StateA: {
      transitionPayloads: {
        GO_TO_B: string;
        ACCUMULATE_IN_A: number;
      };
      model: number;
    };
    StateB: {
      transitionPayloads: {
        GO_TO_A: null;
      };
      model: string;
    };
  }
>;

const fsmInStateA: TestFsm = {
  current: 'StateA',
  graph: {
    StateA: {
      model: 0,
      transitions: {
        GO_TO_B: (model, text) => ['StateB', `Got text ${text} and number ${model}`],
        ACCUMULATE_IN_A: (model, amount) => ['StateA', model + amount],
      },
      render: dispatch => dispatch,
    },
    StateB: {
      model: '',
      transitions: {
        GO_TO_A: () => ['StateA', 0],
      },
      render: dispatch => dispatch,
    },
  },
};

describe('Fsm', () => {
  it('can transition from A to B', async () => {
    await trigger(fsmInStateA, ['GO_TO_B', 'text-from-a'], stateModel => {
      expect(stateModel).toEqual(['StateB', 'Got text text-from-a and number 0']);
    });
  });

  it('can transition from A to itself', async () => {
    await trigger(fsmInStateA, ['ACCUMULATE_IN_A', 10], stateModel => {
      expect(stateModel).toEqual(['StateA', 10]);
    });
  });

  it('can transition from B back to A', async () => {
    const fsmInStateB = await trigger(fsmInStateA, ['GO_TO_B', '']);
    await trigger(fsmInStateB, ['GO_TO_A'], stateModel => {
      expect(stateModel).toEqual(['StateA', 0]);
    });
  });

  it('silently ignores invalid transition', async () => {
    await trigger(fsmInStateA, ['GO_TO_A'], stateModel => {
      expect(stateModel).toEqual(['StateA', 0]);
    });
  });
});

function trigger<A extends TestAction>(
  fsm: TestFsm,
  action: A,
  callback?: (stateModel: [TestState, unknown]) => void,
): Promise<TestFsm> {
  return new Promise((resolve, reject) => {
    try {
      const triggerDispatch = renderCurrent(fsm, newFsm => {
        if (callback) {
          callback(getStateModel(newFsm));
        }
        resolve(newFsm);
      }) as Dispatch<A>;
      triggerDispatch(...action);
    } catch (e) {
      reject(e);
    }
  });
}

function getStateModel(fsm: TestFsm): [TestState, unknown] {
  return [fsm.current, fsm.graph[fsm.current].model];
}
