import * as React from 'react';
import { ToggleContainer, toggleMachine } from './fsm-class';

export class App extends React.Component {
  render() {
    return <ToggleContainer machine={toggleMachine} />;
  }
}
