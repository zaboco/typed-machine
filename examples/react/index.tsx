import * as React from 'react';
import * as ReactDom from 'react-dom';
import { EditableItem } from './EditableItem';

class App extends React.Component {
  render() {
    return (
      <EditableItem
        defaultValue="Foo"
        onChange={value => {
          console.log('Value has changed:', value);
        }}
      />
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
