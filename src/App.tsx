import * as React from 'react';
import { ToggleMachine, toggleGraph } from './fsm-class';

export class App extends React.Component {
  render() {
    return <ToggleMachine current={'Enabled'} graph={toggleGraph} />;
  }
}
