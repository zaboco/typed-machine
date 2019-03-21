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
        [Msg.SAVE]: (s: string) => void;
        [Msg.DISCARD]: null;
      };
      model: { original: string; draft: string };
    };
    Empty: {
      transitionPayloads: {
        [Msg.CHANGE_TEXT]: string;
        [Msg.DELETE]: () => void;
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

export type EditableMachine = Machine<EditableState, EditableTemplate> & { id: string };

const readonlyTransitions: Transitions<EditableMachine, 'Readonly'> = {
  START_EDITING: value => ['Editing', { draft: value, original: value }],
};

const editingTransitions: Transitions<EditableMachine, 'Editing'> = {
  SAVE: ({ draft, original }, onChange) => {
    if (draft !== original) {
      onChange(draft);
    }
    return ['Readonly', draft];
  },
  DISCARD: ({ original }) => ['Readonly', original],
  CHANGE_TEXT: ({ original }, newDraft) =>
    newDraft === '' ? ['Empty', { original }] : ['Editing', { original, draft: newDraft }],
};

const emptyTransitions: Transitions<EditableMachine, 'Empty'> = {
  CHANGE_TEXT: ({ original }, newDraft) =>
    newDraft === '' ? ['Empty', { original }] : ['Editing', { original, draft: newDraft }],
  DISCARD: ({ original }) => ['Readonly', original],
  DELETE: (_, onDelete) => {
    onDelete();
    return ['Deleted', null];
  },
};

export const makeEditableMachine = (defaultValue: string): EditableMachine => ({
  id: Math.random()
    .toString(36)
    .substring(2),
  current: 'Readonly',
  graph: {
    Readonly: {
      model: defaultValue,
      transitions: readonlyTransitions,
    },
    Editing: {
      model: { draft: defaultValue, original: defaultValue },
      transitions: editingTransitions,
    },
    Empty: {
      model: { original: defaultValue },
      transitions: emptyTransitions,
    },
    Deleted: {
      model: null,
      transitions: {},
    },
  },
});
