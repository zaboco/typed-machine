import * as React from 'react';
import { MachineAdapter, ReactView } from '../../src/react';
import {
  EditableMachineOptions,
  EditableTemplate,
  Msg,
  makeEditableMachine,
} from '../shared/EditableMachine';
import '../shared/EditableItem.css';
import { createMachineContainer } from '../../src/core/Machine';

const readonlyView: ReactView<'Readonly', EditableTemplate> = (dispatch, model) => (
  <div className="item">
    <span data-testid="readonly" className="readonly">
      {model}
    </span>
    <button onClick={() => dispatch(Msg.START_EDITING)}>Edit</button>
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
          dispatch(Msg.CHANGE_TEXT, ev.target.value);
        }}
      />
      <button onClick={() => dispatch(Msg.SAVE)}>Save</button>
      <button onClick={() => dispatch(Msg.DISCARD)}>Cancel</button>
    </div>
  );
};

export type EditableItemProps = EditableMachineOptions;

export const EditableItem = (props: EditableItemProps) => (
  <MachineAdapter
    machineContainer={createMachineContainer(makeEditableMachine(props))}
    views={{
      Readonly: readonlyView,
      Editing: editingView,
    }}
  />
);
