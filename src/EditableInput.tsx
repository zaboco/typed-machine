import * as React from 'react';
import { Machine, Graph } from './Machine';
import { Action, action, actionP, ActionP } from './Actions';

type EditiabbleGraph = Graph<EditiabbleState, EditiabbleActionMap, EditiabbleModelMap>;

type EditiabbleState = 'Readonly' | 'Editing';

type EditiabbleActionMap = {
  Readonly: Action<'START_EDITING'>;
  Editing: ActionP<'CHANGE_TEXT', string> | Action<'SAVE'> | Action<'DISCARD'>;
};

type EditiabbleModelMap = {
  Readonly: string;
  Editing: { previous: string; draft: string };
};

const makeEditiabbleGraph = (initialValue: string): EditiabbleGraph => ({
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
});

export type EditiabbleInputProps = {
  initial?: EditiabbleState;
  value: string;
};

export const EditiabbleInput = ({ initial = 'Readonly', value }: EditiabbleInputProps) => (
  <Machine current={initial} graph={makeEditiabbleGraph(value)} />
);
