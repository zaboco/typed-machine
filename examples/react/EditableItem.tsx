import * as React from 'react';
import { MachineContainer, ReactMachine } from '../../src/react/MachineContainer';
import { DefineTemplate } from '../../src/Machine';

import './EditableItem.css';

type EditableMachine = ReactMachine<EditableState, EditableTemplate>;

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

const makeEditableMachine = ({ defaultValue, onChange }: EditableItemProps): EditableMachine => ({
  current: 'Readonly',
  graph: {
    Readonly: {
      model: defaultValue,
      view: (dispatch, model) => (
        <div className="item">
          <span data-testid="readonly" className="readonly">
            {model}
          </span>
          <button onClick={() => dispatch('START_EDITING')}>Edit</button>
        </div>
      ),
      transitions: {
        START_EDITING: value => ['Editing', { draft: value, original: value }],
      },
    },
    Editing: {
      model: { draft: defaultValue, original: defaultValue },
      view: (dispatch, { draft }) => {
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
      },
      transitions: {
        SAVE: ({ draft, original }) => {
          if (draft !== original) {
            onChange(draft);
          }
          return ['Readonly', draft];
        },
        DISCARD: ({ original }) => ['Readonly', original],
        CHANGE_TEXT: ({ original }, newDraft) => ['Editing', { original, draft: newDraft }],
      },
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
