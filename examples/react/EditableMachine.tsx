import { DefineTemplate, Machine, Transitions } from '../../src/core/Machine';

export type EditableState = 'Readonly' | 'Editing';

export type EditableTemplate = DefineTemplate<
  EditableState,
  {
    Readonly: {
      transitionPayloads: {
        START_EDITING: null;
      };
      model: string;
    };
    Editing: {
      transitionPayloads: {
        CHANGE_TEXT: string;
        SAVE: null;
        DISCARD: null;
      };
      model: { original: string; draft: string };
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
    CHANGE_TEXT: ({ original }, newDraft) => ['Editing', { original, draft: newDraft }],
  };
}

export const makeEditableMachine = ({
  defaultValue,
  onChange,
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
  },
});

export type EditableMachineOptions = {
  defaultValue: string;
  onChange: (s: string) => void;
};
