import { DeriveMessage, Dispatch, MessageShape } from '../types/Messages';
import { createMachineContainer, DefineTemplate, Machine, Views } from './Machine';

type TestMachine = Machine<TestState, TestTemplate>;

type TestState = 'StateB' | 'StateA';

type TestView<M extends MessageShape> = { output: string; dispatch: Dispatch<M> };
type MessageA = DeriveMessage<TestTemplate['StateA']['transitionPayloads']>;
type MessageB = DeriveMessage<TestTemplate['StateB']['transitionPayloads']>;

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
  models: {
    StateA: 0,
    StateB: '',
  },
  graph: {
    StateA: {
      GO_TO_B: (model, text) => ['StateB', `payload: ${text} | a-model: ${model}`],
      ACCUMULATE_IN_A: (model, amount) => ['StateA', model + amount],
    },
    StateB: {
      GO_TO_A: () => ['StateA', 0],
    },
  },
};

const views: Views<TestView<MessageA> | TestView<MessageB>, TestState, TestTemplate> = {
  StateA: (dispatch, model) => {
    return {
      dispatch,
      output: `StateA :: ${model}`,
    };
  },
  StateB: (dispatch, model) => {
    return {
      dispatch,
      output: `StateB :: ${model}`,
    };
  },
};
describe('MachineContainer', () => {
  describe('view', () => {
    it('outputs StateA', () => {
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);
      const { output } = container.view(views);
      expect(output).toBe('StateA :: 0');
    });

    it('can transition from A to itself', () => {
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);
      const { dispatch } = container.view(views) as TestView<MessageA>;
      dispatch('ACCUMULATE_IN_A', 3);

      const { output } = container.view(views);

      expect(output).toBe('StateA :: 3');
    });

    it('can transition from A to B', () => {
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);
      const { dispatch } = container.view(views) as TestView<MessageA>;
      dispatch('GO_TO_B', 'text-from-a');

      const { output } = container.view(views);

      expect(output).toBe('StateB :: payload: text-from-a | a-model: 0');
    });

    it('can transition from B back to A', () => {
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);
      const { dispatch } = container.view(views) as TestView<MessageA>;
      dispatch('GO_TO_B', '');
      const { dispatch: dispatchBack } = container.view(views) as TestView<MessageB>;
      dispatchBack('GO_TO_A');

      const { output } = container.view(views);

      expect(output).toBe('StateA :: 0');
    });

    it('silently ignores invalid transition', () => {
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);
      const { dispatch } = container.view(views);
      dispatch('GO_TO_A');

      const { output } = container.view(views);

      expect(output).toBe('StateA :: 0');
    });
  });

  describe('subscribe', () => {
    it('does not notify listener if no transition happened', () => {
      const listenerSpy = jest.fn();
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);
      container.subscribe(listenerSpy);

      container.view(views);

      expect(listenerSpy).not.toHaveBeenCalled();
    });

    it('notifies all listeners on transition', () => {
      const listenerSpies = [jest.fn(), jest.fn()];
      const someText = 'some-text';
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);
      listenerSpies.forEach(container.subscribe);

      const { dispatch } = container.view(views) as TestView<MessageA>;
      dispatch('GO_TO_B', someText);

      listenerSpies.forEach(listenerSpy => {
        expect(listenerSpy).toHaveBeenCalledWith(['GO_TO_B', someText]);
      });
    });

    it('notifies listener for each transition', () => {
      const listenerSpy = jest.fn();
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);

      container.subscribe(listenerSpy);

      const { dispatch } = container.view(views) as TestView<MessageA>;
      dispatch('GO_TO_B', '');
      const { dispatch: dispatchBack } = container.view(views) as TestView<MessageB>;
      dispatchBack('GO_TO_A');

      expect(listenerSpy).toHaveBeenCalledTimes(2);
    });

    it('does not notify listener if unsubscribed', () => {
      const listenerSpy = jest.fn();
      const container = createMachineContainer<TestState, TestTemplate>(machineInStateA);

      const unsubscribe = container.subscribe(listenerSpy);
      unsubscribe();

      const { dispatch } = container.view(views) as TestView<MessageA>;
      dispatch('GO_TO_B', '');

      expect(listenerSpy).not.toHaveBeenCalled();
    });
  });
});
