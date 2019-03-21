import * as React from 'react';
import * as ReactDom from 'react-dom';
import { EditableItem } from './EditableItem';

import '../shared/index.css';
import { BugComponent } from './nested/BugComponent';
import { EditableList } from './list/EditableList';
import { AsyncCounter } from './async/AsyncCounter';

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
        <h1 className="title">Async Counter</h1>
        <AsyncCounter />
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
      <EditableList
        onChange={items => {
          console.log('list has changed:', items);
        }}
        defaultItems={['foo', 'bar', 'baz']}
      />
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
