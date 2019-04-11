import * as React from 'react';
import { MachineAdapter, ReactView } from '../../src/react';
import { EditableMachineContainer, EditableTemplate, Msg } from '../shared/EditableMachine';
import '../shared/EditableItem.css';

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

export type EditableItemProps = {
  machine: EditableMachineContainer;
};

export const EditableItem = (props: EditableItemProps) => (
  <MachineAdapter
    machineContainer={props.machine}
    views={{
      Readonly: readonlyView,
      Editing: editingView,
    }}
  />
);
