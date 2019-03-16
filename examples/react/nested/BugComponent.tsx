import * as React from 'react';
import { MachineContainer, ReactViews } from '../../../src/react';
import { bugMachine, BugState, BugTemplate } from './BugMachine';
import './BugComponent.css';

export const BugComponent = (props: { name: string }) => (
  <MachineContainer
    machine={bugMachine}
    views={
      {
        Open: dispatch => (
          <div className="bug-row">
            <div style={{ color: 'red' }}>{props.name}</div>
            <button onClick={() => dispatch('RESOLVE')}>Resolve</button>
          </div>
        ),
        'Closed.Unarchived': dispatch => (
          <div className="bug-row">
            <div style={{ color: 'green' }}>{props.name}</div>
            <button onClick={() => dispatch('ARCHIVE')}>Archive</button>
            <button onClick={() => dispatch('REOPEN')}>Reopen</button>
          </div>
        ),
        'Closed.Archived': dispatch => (
          <div className="bug-row">
            <div style={{ color: 'gray', fontStyle: 'italic' }}>{props.name}</div>
            <button onClick={() => dispatch('RESTORE')}>Restore</button>
            <button onClick={() => dispatch('REOPEN')}>Reopen</button>
          </div>
        ),
      } as ReactViews<BugState, BugTemplate>
    }
  />
);
