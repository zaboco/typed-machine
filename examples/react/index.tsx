import * as React from 'react';
import * as ReactDom from 'react-dom';
import { EditableItem } from './EditableItem';

import './index.css';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1 className="title">Editable Item</h1>
        <EditableItem
          defaultValue="Foo"
          onChange={value => {
            console.log('Value has changed:', value);
          }}
        />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
