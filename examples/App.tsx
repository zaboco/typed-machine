import * as React from 'react';
import { EditableInput } from './EditableInput';
import { Toggle } from './Toggle';

export class App extends React.Component {
  render() {
    return (
      <div>
        <Toggle />
        <EditableInput
          defaultValue="Foo"
          onChange={value => {
            console.log('Value has changed:', value);
          }}
        />
      </div>
    );
  }
}
