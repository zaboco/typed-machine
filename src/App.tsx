import * as React from 'react';
import { EditiabbleInput } from './EditableInput';
import { ToggleMachine } from './ToggleMachine';

export class App extends React.Component {
  render() {
    // return <ToggleMachine />;
    return <EditiabbleInput value="Foo" />;
  }
}
