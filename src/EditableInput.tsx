import * as React from 'react';
import { Machine, Graph } from './Machine';
import { Action, action } from './Actions';

type EditiabbleGraph = Graph<EditiabbleState, EditiabbleActionMap>;

type EditiabbleState = 'Readonly' | 'Editing';

type EditiabbleActionMap = {
  Readonly: Action<'START_EDITING'>;
  Editing: Action<'CHANGE_TEXT', string> | Action<'SAVE'> | Action<'DISCARD'>;
};

const EditiabbleGraph: EditiabbleGraph = {
  Readonly: {
    render: dispatch => (
      <div>
        Enabled
        <button onClick={() => dispatch(action('START_EDITING'))}>Edit</button>
      </div>
    ),
    transition: action => {
      switch (action.type) {
        case 'START_EDITING':
          return 'Editing';
      }
    },
  },
  Editing: {
    render: dispatch => (
      <div>
        Disabled
        <button onClick={() => dispatch(action('SAVE'))}>Save</button>
        <button onClick={() => dispatch(action('DISCARD'))}>Cancel</button>
      </div>
    ),
    transition: action => {
      switch (action.type) {
        case 'SAVE':
        case 'DISCARD':
        case 'CHANGE_TEXT':
          return 'Readonly';
      }
    },
  },
};

export const EditiabbleInput = ({ initial = 'Readonly' }: { initial?: EditiabbleState }) => (
  <Machine current={initial} graph={EditiabbleGraph} />
);
