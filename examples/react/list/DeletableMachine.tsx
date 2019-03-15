import { DefineTemplate, Machine, Transitions } from '../../../src/core/Machine';

export type EditableState = 'Readonly' | 'Editing' | 'Empty' | 'Deleted';

export enum Msg {
  START_EDITING = 'START_EDITING',
  CHANGE_TEXT = 'CHANGE_TEXT',
  SAVE = 'SAVE',
  DISCARD = 'DISCARD',
  DELETE = 'DELETE',
}

export type EditableTemplate = DefineTemplate<
  EditableState,
  {
    Readonly: {
      transitionPayloads: {
        [Msg.START_EDITING]: null;
      };
      model: string;
    };
    Editing: {
      transitionPayloads: {
        [Msg.CHANGE_TEXT]: string;
        [Msg.SAVE]: null;
        [Msg.DISCARD]: null;
      };
      model: { original: string; draft: string };
    };
    Empty: {
      transitionPayloads: {
        [Msg.CHANGE_TEXT]: string;
        [Msg.DELETE]: null;
        [Msg.DISCARD]: null;
      };
      model: { original: string };
    };
    Deleted: {
      transitionPayloads: {};
      model: null;
    };
  }
>;

type EditableMachine = Machine<EditableState, EditableTemplate>;

const readonlyTransitions: Transitions<EditableMachine, 'Readonly'> = {
  START_EDITING: value => ['Editing', { draft: value, original: value }],
};

function makeEditingTransitions(
  onChange: EditableMachineOptions['onChange'],
): Transitions<EditableMachine, 'Editing'> {
  return {
    SAVE: ({ draft, original }) => {
      if (draft !== original) {
        onChange(draft);
      }
      return ['Readonly', draft];
    },
    DISCARD: ({ original }) => ['Readonly', original],
    CHANGE_TEXT: ({ original }, newDraft) =>
      newDraft === '' ? ['Empty', { original }] : ['Editing', { original, draft: newDraft }],
  };
}

function makeEmptyTransitions(
  onDelete: EditableMachineOptions['onDelete'],
): Transitions<EditableMachine, 'Empty'> {
  return {
    CHANGE_TEXT: ({ original }, newDraft) =>
      newDraft === '' ? ['Empty', { original }] : ['Editing', { original, draft: newDraft }],
    DISCARD: ({ original }) => ['Readonly', original],
    DELETE: () => {
      onDelete();
      return ['Deleted', null];
    },
  };
}

export const makeEditableMachine = ({
  defaultValue,
  onChange,
  onDelete,
}: EditableMachineOptions): EditableMachine => ({
  current: 'Readonly',
  graph: {
    Readonly: {
      model: defaultValue,
      transitions: readonlyTransitions,
    },
    Editing: {
      model: { draft: defaultValue, original: defaultValue },
      transitions: makeEditingTransitions(onChange),
    },
    Empty: {
      model: { original: defaultValue },
      transitions: makeEmptyTransitions(onDelete),
    },
    Deleted: {
      model: null,
      transitions: {},
    },
  },
});

export type EditableMachineOptions = {
  defaultValue: string;
  onChange: (s: string) => void;
  onDelete: () => void;
};
