import * as React from 'react';
import { Machine } from '../src/react/Machine';
import { Fsm, DefineTemplate } from '../src/Fsm';

type EditiableFsm = Fsm<EditiableState, EditableTemplate>;

type EditiableState = 'Readonly' | 'Editing';

type EditableTemplate = DefineTemplate<
  EditiableState,
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
      model: { previous: string; draft: string };
    };
  }
>;

const makeEditiabbleFsm = (initialValue: string): EditiableFsm => ({
  current: 'Readonly',
  graph: {
    Readonly: {
      model: initialValue,
      render: (dispatch, model) => (
        <div>
          {model}
          <button onClick={() => dispatch('START_EDITING')}>Edit</button>
        </div>
      ),
      transitions: {
        START_EDITING: value => ['Editing', { draft: value, previous: value }],
      },
    },
    Editing: {
      model: { draft: initialValue, previous: initialValue },
      render: (dispatch, { draft }) => {
        return (
          <div>
            <input
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
      },
      transitions: {
        SAVE: ({ draft }) => ['Readonly', draft],
        DISCARD: ({ previous }) => ['Readonly', previous],
        CHANGE_TEXT: ({ previous }, newDraft) => ['Editing', { previous, draft: newDraft }],
      },
    },
  },
});

export type EditiabbleInputProps = {
  value: string;
};

export const EditiabbleInput = ({ value }: EditiabbleInputProps) => (
  <Machine {...makeEditiabbleFsm(value)} />
);
