import * as React from 'react';
import { MachineContainer, ReactView } from '../../src/react';
import {
  EditableMachineOptions,
  EditableTemplate,
  makeEditableMachine,
} from '../shared/EditableMachine';
import '../shared/EditableItem.css';

const readonlyView: ReactView<'Readonly', EditableTemplate> = (dispatch, model) => (
  <div className="item">
    <span data-testid="readonly" className="readonly">
      {model}
    </span>
    <button onClick={() => dispatch('START_EDITING')}>Edit</button>
  </div>
);

const editingView: ReactView<'Editing', EditableTemplate> = (dispatch, { draft }) => {
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

export type EditableItemProps = EditableMachineOptions;

export const EditableItem = (props: EditableItemProps) => (
  <MachineContainer
    machine={makeEditableMachine(props)}
    views={{
      Readonly: readonlyView,
      Editing: editingView,
    }}
  />
);
