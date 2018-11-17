import * as React from 'react';
import { Machine, ReactFsm } from '../../src/react/Machine';
import { DefineTemplate } from '../../src/Fsm';

type EditableFsm = ReactFsm<EditableState, EditableTemplate>;

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
      model: { previous: string; draft: string };
    };
  }
>;

const makeEditableFsm = ({ defaultValue, onChange }: EditableItemProps): EditableFsm => ({
  current: 'Readonly',
  graph: {
    Readonly: {
      model: defaultValue,
      render: (dispatch, model) => (
        <div>
          <span data-testid="readonly">{model}</span>
          <button onClick={() => dispatch('START_EDITING')}>Edit</button>
        </div>
      ),
      transitions: {
        START_EDITING: value => ['Editing', { draft: value, previous: value }],
      },
    },
    Editing: {
      model: { draft: defaultValue, previous: defaultValue },
      render: (dispatch, { draft }) => {
        return (
          <div>
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
        SAVE: ({ draft, previous }) => {
          if (draft !== previous) {
            onChange(draft);
          }
          return ['Readonly', draft];
        },
        DISCARD: ({ previous }) => ['Readonly', previous],
        CHANGE_TEXT: ({ previous }, newDraft) => ['Editing', { previous, draft: newDraft }],
      },
    },
  },
});

export type EditableItemProps = {
  defaultValue: string;
  onChange: (s: string) => void;
};

export const EditableItem = (props: EditableItemProps) => <Machine {...makeEditableFsm(props)} />;
