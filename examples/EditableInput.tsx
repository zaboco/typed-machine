import * as React from 'react';
import { Machine } from '../src/react/Machine';
import { Action, action, actionP, ActionP } from '../src/types/Actions';
import { Fsm, DefineTemplate } from '../src/Fsm';

type EditiableFsm = Fsm<EditiableState, EditableTemplate>;

type EditiableState = 'Readonly' | 'Editing';

type EditableTemplate = DefineTemplate<
  EditiableState,
  {
    Readonly: {
      action: Action<'START_EDITING'>;
      model: string;
    };
    Editing: {
      action: ActionP<'CHANGE_TEXT', string> | Action<'SAVE'> | Action<'DISCARD'>;
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
          <button onClick={() => dispatch(action('START_EDITING'))}>Edit</button>
        </div>
      ),
      transition: (action, model) => {
        switch (action.type) {
          case 'START_EDITING':
            return ['Editing', { draft: model, previous: model }];
        }
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
                dispatch(actionP('CHANGE_TEXT', ev.target.value));
              }}
            />
            <button onClick={() => dispatch(action('SAVE'))}>Save</button>
            <button onClick={() => dispatch(action('DISCARD'))}>Cancel</button>
          </div>
        );
      },
      transition: (action, { previous, draft }) => {
        switch (action.type) {
          case 'SAVE':
            return ['Readonly', draft];
          case 'DISCARD':
            return ['Readonly', previous];
          case 'CHANGE_TEXT':
            return ['Editing', { previous, draft: action.payload }];
        }
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