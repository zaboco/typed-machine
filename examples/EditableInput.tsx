import * as React from 'react';
import { Machine } from '../src/react/Machine';
import { Action } from '../src/types/Actions';
import { Fsm, DefineTemplate } from '../src/Fsm';

type EditiableFsm = Fsm<EditiableState, EditableTemplate>;

type EditiableState = 'Readonly' | 'Editing';

type EditableTemplate = DefineTemplate<
  EditiableState,
  {
    Readonly: {
      action: Action<'START_EDITING'>;
      actionPayloads: {
        START_EDITING: null;
      };
      model: string;
    };
    Editing: {
      action: Action<'CHANGE_TEXT', string> | Action<'SAVE'> | Action<'DISCARD'>;
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
        START_EDITING: () => ['Editing', { draft: 'model', previous: 'model' }],
      },
      transition: (action, model) => {
        switch (action[0]) {
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
                dispatch(['CHANGE_TEXT', ev.target.value]);
              }}
            />
            <button onClick={() => dispatch(['SAVE'])}>Save</button>
            <button onClick={() => dispatch(['DISCARD'])}>Cancel</button>
          </div>
        );
      },
      actionHandlers: {
        SAVE: () => ['Readonly', 'draft'],
        DISCARD: () => ['Readonly', 'previous'],
        CHANGE_TEXT: draft => ['Editing', { previous: 'previous', draft }],
      },
      transition: (action, { previous, draft }) => {
        switch (action[0]) {
          case 'SAVE':
            return ['Readonly', draft];
          case 'DISCARD':
            return ['Readonly', previous];
          case 'CHANGE_TEXT':
            return ['Editing', { previous, draft: action[1] }];
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
