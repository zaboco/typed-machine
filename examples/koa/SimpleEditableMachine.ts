import { DefineTemplate, Machine, Transitions } from '../../src/core/Machine';

export type EditableState = 'Readonly' | 'Editing';

export type EditableTemplate = DefineTemplate<
  EditableState,
  {
    Readonly: {
      transitionPayloads: {
        START_EDITING: null;
      };
      model: { value: string };
    };
    Editing: {
      transitionPayloads: {
        SAVE: string;
        DISCARD: null;
      };
      model: { original: string };
    };
  }
>;

export type EditableMachine = Machine<EditableState, EditableTemplate>;

const readonlyTransitions: Transitions<EditableMachine, 'Readonly'> = {
  START_EDITING: ({ value }) => ['Editing', { original: value }],
};

function makeEditingTransitions(
  onChange: EditableMachineOptions['onChange'],
): Transitions<EditableMachine, 'Editing'> {
  return {
    SAVE: ({ original }, newValue) => {
      if (newValue !== original) {
        onChange(newValue);
      }
      return ['Readonly', { value: newValue }];
    },
    DISCARD: ({ original }) => ['Readonly', { value: original }],
  };
}

export const makeEditableMachine = ({
  defaultValue,
  onChange,
}: EditableMachineOptions): EditableMachine => ({
  current: 'Readonly',
  graph: {
    Readonly: {
      model: { value: defaultValue },
      transitions: readonlyTransitions,
    },
    Editing: {
      model: { original: defaultValue },
      transitions: makeEditingTransitions(onChange),
    },
  },
});

export type EditableMachineOptions = {
  defaultValue: string;
  onChange: (s: string) => void;
};
