import * as React from 'react';
import { EditiabbleInput } from './EditableInput';
import { Toggle } from './Toggle';

export class App extends React.Component {
  render() {
    return (
      <div>
        <Toggle />
        <EditiabbleInput
          defaultValue="Foo"
          onChange={value => {
            console.log('Value has changed:', value);
          }}
        />
      </div>
    );
  }
}
