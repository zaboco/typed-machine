import * as React from 'react';
import { MachineContainer, ReactView } from '../../../src/react';
import {
  EditableMachineOptions,
  EditableTemplate,
  Msg,
  makeEditableMachine,
} from './DeletableMachine';
import '../../shared/EditableItem.css';

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

const emptyView: ReactView<'Empty', EditableTemplate> = dispatch => {
  return (
    <div className="item">
      <input
        data-testid="draft-input"
        type="text"
        value={''}
        autoFocus={true}
        onChange={ev => {
          dispatch(Msg.CHANGE_TEXT, ev.target.value);
        }}
      />
      <button onClick={() => dispatch(Msg.DELETE)}>Delete</button>
      <button onClick={() => dispatch(Msg.DISCARD)}>Cancel</button>
    </div>
  );
};

const deletedView: ReactView<'Deleted', EditableTemplate> = () => {
  return (
    <div className="item">
      <span className="readonly">
        <i>--deleted--</i>
      </span>
    </div>
  );
};

export type EditableItemProps = EditableMachineOptions;

export const DeletableItem = (props: EditableItemProps) => (
  <MachineContainer
    machine={makeEditableMachine(props)}
    views={{
      Readonly: readonlyView,
      Editing: editingView,
      Empty: emptyView,
      Deleted: deletedView,
    }}
  />
);
