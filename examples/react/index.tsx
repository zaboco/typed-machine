import * as React from 'react';
import * as ReactDom from 'react-dom';
import { EditableInput } from './EditableInput';

class App extends React.Component {
  render() {
    return (
      <EditableInput
        defaultValue="Foo"
        onChange={value => {
          console.log('Value has changed:', value);
        }}
      />
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
