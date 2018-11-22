import * as React from 'react';
import { MachineContainer, ReactMachine } from '../../src/react/MachineContainer';
import { DefineTemplate, Transitions, View } from '../../src/Machine';

import './EditableItem.css';

export type EditableState = 'Readonly' | 'Editing';

type EditableTemplate = DefineTemplate<
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

type EditableMachine = ReactMachine<EditableState, EditableTemplate>;

const readonlyTransitions: Transitions<EditableMachine, 'Readonly'> = {
  START_EDITING: value => ['Editing', { draft: value, original: value }],
};

function makeEditingTransitions(
  onChange: EditableItemProps['onChange'],
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

const readonlyView: View<EditableMachine, 'Readonly'> = (dispatch, model) => (
  <div className="item">
    <span data-testid="readonly" className="readonly">
      {model}
    </span>
    <button onClick={() => dispatch('START_EDITING')}>Edit</button>
  </div>
);

const editingView: View<EditableMachine, 'Editing'> = (dispatch, { draft }) => {
  return (
    <div className="item">
      <input
        data-testid="draft-input"
        type="text"
        value={draft}
        autoFocus={true}
        onChange={ev => {
          dispatch('CHANGE_TEXT', ev.target.value);
        }}
      />
      <button onClick={() => dispatch('SAVE')}>Save</button>
      <button onClick={() => dispatch('DISCARD')}>Cancel</button>
    </div>
  );
};

const makeEditableMachine = ({ defaultValue, onChange }: EditableItemProps): EditableMachine => ({
  current: 'Readonly',
  graph: {
    Readonly: {
      model: defaultValue,
      transitions: readonlyTransitions,
      view: readonlyView,
    },
    Editing: {
      model: { draft: defaultValue, original: defaultValue },
      transitions: makeEditingTransitions(onChange),
      view: editingView,
    },
  },
});

export type EditableItemProps = {
  defaultValue: string;
  onChange: (s: string) => void;
};

export const EditableItem = (props: EditableItemProps) => (
  <MachineContainer {...makeEditableMachine(props)} />
);
