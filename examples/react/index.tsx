import * as React from 'react';
import * as ReactDom from 'react-dom';
import { EditableItem } from './EditableItem';

import '../shared/index.css';
import { initEditableMachine } from '../shared/EditableMachine';

type AppState = {
  items: string[];
};

class App extends React.Component<{}, AppState> {
  state: AppState = {
    items: ['foo', 'bar', 'baz'],
  };

  render() {
    const machine = initEditableMachine('Readonly', 'Foo');
    return (
      <div className="app">
        <h1 className="title">Editable Item</h1>
        <EditableItem machine={machine} />
        <EditableItem machine={machine} />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
