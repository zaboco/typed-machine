import { Dispatch, MessageShape } from '../types/Messages';
import { DefineTemplate, machineFactory, MachineGraph, Message, Views } from './Machine';

type TestMachineGraph = MachineGraph<TestState, TestTemplate>;

type TestState = 'StateB' | 'StateA';

type TestView<M extends MessageShape> = { output: string; dispatch: Dispatch<M> };
type MessageA = Message<'StateA', TestTemplate>;
type MessageB = Message<'StateB', TestTemplate>;

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

const machineGraph: TestMachineGraph = {
  StateA: {
    GO_TO_B: (model, text) => ['StateB', `payload: ${text} | a-model: ${model}`],
    ACCUMULATE_IN_A: (model, amount) => ['StateA', model + amount],
  },
  StateB: {
    GO_TO_A: () => ['StateA', 0],
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
describe('Machine', () => {
  const initMachine = machineFactory<TestState, TestTemplate>(machineGraph);

  describe('currentView', () => {
    it('outputs StateA', () => {
      const machine = initMachine('StateA', 0);
      const { output } = machine.currentView(views);
      expect(output).toBe('StateA :: 0');
    });

    it('can start from StateB', () => {
      const machine = initMachine('StateB', 'started');
      const { output } = machine.currentView(views);
      expect(output).toBe('StateB :: started');
    });

    it('can transition from A to itself', () => {
      const machine = initMachine('StateA', 0);
      const { dispatch } = machine.currentView(views) as TestView<MessageA>;
      dispatch('ACCUMULATE_IN_A', 3);

      const { output } = machine.currentView(views);

      expect(output).toBe('StateA :: 3');
    });

    it('can transition from A to B', () => {
      const machine = initMachine('StateA', 0);
      const { dispatch } = machine.currentView(views) as TestView<MessageA>;
      dispatch('GO_TO_B', 'text-from-a');

      const { output } = machine.currentView(views);

      expect(output).toBe('StateB :: payload: text-from-a | a-model: 0');
    });

    it('can transition from B back to A', () => {
      const machine = initMachine('StateA', 0);
      const { dispatch } = machine.currentView(views) as TestView<MessageA>;
      dispatch('GO_TO_B', '');
      const { dispatch: dispatchBack } = machine.currentView(views) as TestView<MessageB>;
      dispatchBack('GO_TO_A');

      const { output } = machine.currentView(views);

      expect(output).toBe('StateA :: 0');
    });

    it('silently ignores invalid transition', () => {
      const machine = initMachine('StateA', 0);
      const { dispatch } = machine.currentView(views);
      // @ts-ignore
      dispatch('GO_TO_A');

      const { output } = machine.currentView(views);

      expect(output).toBe('StateA :: 0');
    });
  });

  describe('subscribe', () => {
    it('does not notify listener if no transition happened', () => {
      const listenerSpy = jest.fn();
      const machine = initMachine('StateA', 0);
      machine.subscribe(listenerSpy);

      machine.currentView(views);

      expect(listenerSpy).not.toHaveBeenCalled();
    });

    it('notifies all listeners on transition', () => {
      const listenerSpies = [jest.fn(), jest.fn()];
      const someText = 'some-text';
      const machine = initMachine('StateA', 0);
      listenerSpies.forEach(machine.subscribe);

      const { dispatch } = machine.currentView(views) as TestView<MessageA>;
      dispatch('GO_TO_B', someText);

      listenerSpies.forEach(listenerSpy => {
        expect(listenerSpy).toHaveBeenCalledWith(['GO_TO_B', someText]);
      });
    });

    it('notifies listener for each transition', () => {
      const listenerSpy = jest.fn();
      const machine = initMachine('StateA', 0);

      machine.subscribe(listenerSpy);

      const { dispatch } = machine.currentView(views) as TestView<MessageA>;
      dispatch('GO_TO_B', '');
      const { dispatch: dispatchBack } = machine.currentView(views) as TestView<MessageB>;
      dispatchBack('GO_TO_A');

      expect(listenerSpy).toHaveBeenCalledTimes(2);
    });

    it('does not notify listener if unsubscribed', () => {
      const listenerSpy = jest.fn();
      const machine = initMachine('StateA', 0);

      const unsubscribe = machine.subscribe(listenerSpy);
      unsubscribe();

      const { dispatch } = machine.currentView(views) as TestView<MessageA>;
      dispatch('GO_TO_B', '');

      expect(listenerSpy).not.toHaveBeenCalled();
    });
  });
});
