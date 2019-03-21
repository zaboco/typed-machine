import { DefineTemplate, Machine, Transitions } from '../../../src/core/Machine';
import { EditableMachine, makeEditableMachine } from './DeletableMachine';

export enum EditableListState {
  Editing = 'Editing',
}

export enum EditableListMsg {
  ADD = 'ADD',
  DELETE = 'DELETE',
  CHANGE = 'CHANGE',
}

type OnChange = (is: string[]) => void;

export type EditableListTemplate = DefineTemplate<
  EditableListState,
  {
    Editing: {
      transitionPayloads: {
        [EditableListMsg.ADD]: OnChange;
        [EditableListMsg.DELETE]: { index: number; onChange: OnChange };
        [EditableListMsg.CHANGE]: { index: number; value: string; onChange: OnChange };
      };
      model: EditableMachine[];
    };
  }
>;

type EditableListMachine = Machine<EditableListState, EditableListTemplate>;

function makeEditingTransitions(): Transitions<EditableListMachine, EditableListState.Editing> {
  return {
    ADD: (items, onChange) => {
      let newItems = [makeEditableMachine('new'), ...items];
      onChange(newItems.map(getValue));
      return [EditableListState.Editing, newItems];
    },
    DELETE: (items, { index, onChange }) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems.map(getValue));
      return [EditableListState.Editing, newItems];
    },
    CHANGE: (items, { index, value, onChange }) => {
      const itemValues = items.map(getValue);
      itemValues.splice(index, 1, value);
      onChange(itemValues);
      return [EditableListState.Editing, items];
    },
  };
}

function getValue(itemMachine: EditableMachine): string {
  return itemMachine.graph.Readonly.model;
}

export function makeEditableListMachine(defaultItems: string[]): EditableListMachine {
  return {
    current: EditableListState.Editing,
    graph: {
      Editing: {
        model: defaultItems.map(makeEditableMachine),
        transitions: makeEditingTransitions(),
      },
    },
  };
}
