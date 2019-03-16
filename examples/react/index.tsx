import * as React from 'react';
import * as ReactDom from 'react-dom';
import { EditableItem } from './EditableItem';

import '../shared/index.css';
import { DeletableItem } from './list/DeletableItem';
import { MachineContainer, ReactViews } from '../../src/react';
import {
  EditableListMsg,
  EditableListState,
  EditableListTemplate,
  makeEditableListMachine,
} from './list/EditableListMachine';
import { BugComponent } from './nested/BugComponent';

type AppState = {
  items: string[];
};

class App extends React.Component<{}, AppState> {
  state: AppState = {
    items: ['foo', 'bar', 'baz'],
  };

  render() {
    return (
      <div className="app">
        <h1 className="title">Bug</h1>
        <BugComponent name="Typed-machine fails" />
        <h1 className="title">Editable Item</h1>
        <EditableItem
          defaultValue="Foo"
          onChange={value => {
            console.log('Value has changed:', value);
          }}
        />
        {this.renderList()}
      </div>
    );
  }

  private renderList() {
    return (
      <MachineContainer
        machine={makeEditableListMachine({
          onChange: items => {
            console.log('list has changed:', items);
          },
          defaultItems: ['foo', 'bar', 'baz'],
        })}
        views={
          {
            Editing: (dispatch, items) => {
              return (
                <>
                  <h1 className="title">Deletable Items</h1>
                  <button
                    onClick={() => {
                      dispatch(EditableListMsg.ADD);
                    }}
                  >
                    Add item
                  </button>
                  <div>
                    {items.map((item, index) => {
                      return (
                        <DeletableItem
                          key={`${item}-${index}-${Date.now()}`}
                          defaultValue={item}
                          onChange={value => {
                            dispatch(EditableListMsg.CHANGE, { index, value });
                          }}
                          onDelete={() => {
                            setTimeout(() => {
                              dispatch(EditableListMsg.DELETE, index);
                            }, 1000);
                          }}
                        />
                      );
                    })}
                  </div>
                </>
              );
            },
          } as ReactViews<EditableListState.Editing, EditableListTemplate>
        }
      />
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
