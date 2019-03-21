import {
  EditableListMsg,
  EditableListState,
  EditableListTemplate,
  makeEditableListMachine,
} from './EditableListMachine';
import { MachineContainer } from '../../../src/react';
import * as React from 'react';
import { EditableState, EditableTemplate, Msg } from './DeletableMachine';

export type EditableListProps = {
  onChange: (is: string[]) => void;
  defaultItems: string[];
};

export const EditableList = (props: EditableListProps) => (
  <MachineContainer<EditableListState, EditableListTemplate>
    machine={makeEditableListMachine(props.defaultItems)}
    views={{
      Editing: (dispatchUp, itemMachines) => {
        return (
          <>
            <h1 className="title">Deletable Items</h1>
            <button
              onClick={() => {
                dispatchUp(EditableListMsg.ADD, props.onChange);
              }}
            >
              Add item
            </button>
            <div>
              {itemMachines.map((item, index) => {
                return (
                  <div key={item.id} id={item.id}>
                    <MachineContainer<EditableState, EditableTemplate>
                      machine={item}
                      views={{
                        Readonly: (dispatch, model) => (
                          <div className="item">
                            <span data-testid="readonly" className="readonly">
                              {model}
                            </span>
                            <button onClick={() => dispatch(Msg.START_EDITING)}>Edit</button>
                          </div>
                        ),
                        Editing: (dispatch, { draft }) => {
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
                              <button
                                onClick={() =>
                                  dispatch(Msg.SAVE, value => {
                                    dispatchUp(EditableListMsg.CHANGE, {
                                      index,
                                      value,
                                      onChange: props.onChange,
                                    });
                                  })
                                }
                              >
                                Save
                              </button>
                              <button onClick={() => dispatch(Msg.DISCARD)}>Cancel</button>
                            </div>
                          );
                        },
                        Empty: dispatch => {
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
                              <button
                                onClick={() =>
                                  dispatch(Msg.DELETE, () => {
                                    dispatchUp(EditableListMsg.DELETE, {
                                      index,
                                      onChange: props.onChange,
                                    });
                                  })
                                }
                              >
                                Delete
                              </button>
                              <button onClick={() => dispatch(Msg.DISCARD)}>Cancel</button>
                            </div>
                          );
                        },
                        Deleted: () => {
                          return (
                            <div className="item">
                              <span className="readonly">
                                <i>--deleted--</i>
                              </span>
                            </div>
                          );
                        },
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );
      },
    }}
  />
);
