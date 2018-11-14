import * as React from 'react';
import { Machine } from '../src/react/Machine';
import { Fsm, DefineTemplate } from '../src/Fsm';

type EditiableFsm = Fsm<EditiableState, EditableTemplate>;

type EditiableState = 'Readonly' | 'Editing';

type EditableTemplate = DefineTemplate<
  EditiableState,
  {
    Readonly: {
      actionPayloads: {
        START_EDITING: null;
      };
      model: string;
    };
    Editing: {
      actionPayloads: {
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
          <button onClick={() => dispatch(['START_EDITING'])}>Edit</button>
        </div>
      ),
      actionHandlers: {
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
                dispatch(['CHANGE_TEXT', ev.target.value]);
              }}
            />
            <button onClick={() => dispatch(['SAVE'])}>Save</button>
            <button onClick={() => dispatch(['DISCARD'])}>Cancel</button>
          </div>
        );
      },
      actionHandlers: {
        SAVE: ({ draft }) => ['Readonly', draft],
        DISCARD: ({ previous }) => ['Readonly', previous],
        CHANGE_TEXT: ({ previous }, draft) => ['Editing', { previous, draft }],
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
