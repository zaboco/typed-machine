import { DefineTemplate, Machine, currentView } from './Machine';
import { DeriveMessage, Dispatch } from './types/Messages';

type TestMachine = Machine<TestDispatch, TestState, TestTemplate>;

type TestState = 'StateB' | 'StateA';

type TestDispatch = Dispatch<MessageA> | Dispatch<MessageB>;
type TestMessage = MessageA | MessageB;
type MessageA = DeriveMessage<TestTemplate['StateB']['transitionPayloads']>;
type MessageB = DeriveMessage<TestTemplate['StateA']['transitionPayloads']>;

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

const machineInStateA: TestMachine = {
  current: 'StateA',
  graph: {
    StateA: {
      model: 0,
      transitions: {
        GO_TO_B: (model, text) => ['StateB', `Got text ${text} and number ${model}`],
        ACCUMULATE_IN_A: (model, amount) => ['StateA', model + amount],
      },
      view: dispatch => dispatch,
    },
    StateB: {
      model: '',
      transitions: {
        GO_TO_A: () => ['StateA', 0],
      },
      view: dispatch => dispatch,
    },
  },
};

describe('Machine', () => {
  it('can transition from A to B', async () => {
    await trigger(machineInStateA, ['GO_TO_B', 'text-from-a'], stateModel => {
      expect(stateModel).toEqual(['StateB', 'Got text text-from-a and number 0']);
    });
  });

  it('can transition from A to itself', async () => {
    await trigger(machineInStateA, ['ACCUMULATE_IN_A', 10], stateModel => {
      expect(stateModel).toEqual(['StateA', 10]);
    });
  });

  it('can transition from B back to A', async () => {
    const machineInStateB = await trigger(machineInStateA, ['GO_TO_B', '']);
    await trigger(machineInStateB, ['GO_TO_A'], stateModel => {
      expect(stateModel).toEqual(['StateA', 0]);
    });
  });

  it('silently ignores invalid transition', async () => {
    await trigger(machineInStateA, ['GO_TO_A'], stateModel => {
      expect(stateModel).toEqual(['StateA', 0]);
    });
  });
});

function trigger<A extends TestMessage>(
  machine: TestMachine,
  message: A,
  callback?: (stateModel: [TestState, unknown]) => void,
): Promise<TestMachine> {
  return new Promise((resolve, reject) => {
    try {
      const triggerDispatch = currentView(machine, newMachine => {
        if (callback) {
          callback(getStateModel(newMachine));
        }
        resolve(newMachine);
      }) as Dispatch<A>;
      triggerDispatch(...message);
    } catch (e) {
      reject(e);
    }
  });
}

function getStateModel(machine: TestMachine): [TestState, unknown] {
  return [machine.current, machine.graph[machine.current].model];
}
