import { DefineTemplate, Machine, Transitions } from '../../../src/core/Machine';

export enum EditableListState {
  Editing = 'Editing',
}

export enum EditableListMsg {
  ADD = 'ADD',
  DELETE = 'DELETE',
  CHANGE = 'CHANGE',
}

export type EditableListTemplate = DefineTemplate<
  EditableListState,
  {
    Editing: {
      transitionPayloads: {
        [EditableListMsg.ADD]: null;
        [EditableListMsg.DELETE]: number;
        [EditableListMsg.CHANGE]: { index: number; value: string };
      };
      model: string[];
    };
  }
>;

type EditableListMachine = Machine<EditableListState, EditableListTemplate>;

export type EditableListMachineOptions = {
  defaultItems: string[];
  onChange: (is: string[]) => void;
};

function makeEditingTransitions(
  onChange: EditableListMachineOptions['onChange'],
): Transitions<EditableListMachine, EditableListState.Editing> {
  return {
    ADD: items => {
      onChange;
      let newItems = ['new', ...items];
      onChange(newItems);
      return [EditableListState.Editing, newItems];
    },
    DELETE: (items, index) => {
      items.splice(index, 1);
      onChange(items);
      return [EditableListState.Editing, items];
    },
    CHANGE: (items, { index, value }) => {
      items.splice(index, 1, value);
      onChange(items);
      return [EditableListState.Editing, items];
    },
  };
}

export function makeEditableListMachine(options: EditableListMachineOptions): EditableListMachine {
  return {
    current: EditableListState.Editing,
    graph: {
      Editing: {
        model: options.defaultItems,
        transitions: makeEditingTransitions(options.onChange),
      },
    },
  };
}
