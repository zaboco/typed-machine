import * as React from 'react';
import { MachineContainer, ReactViews } from '../../../src/react';
import {
  archivableMachime,
  ArchivableState,
  ArchivableTemplate,
  bugMachine,
  BugState,
  BugTemplate,
} from './BugMachine';
import './BugComponent.css';

const ArchivableComponent = (props: { name: string }) => (
  <MachineContainer
    machine={archivableMachime}
    views={
      {
        Unarchived: dispatch => (
          <div className="bug-row">
            <div style={{ color: 'green' }}>{props.name}</div>
            <button onClick={() => dispatch('ARCHIVE')}>Archive</button>
          </div>
        ),
        Archived: dispatch => (
          <div className="bug-row">
            <div style={{ color: 'gray', fontStyle: 'italic' }}>{props.name}</div>
            <button onClick={() => dispatch('RESTORE')}>Restore</button>
          </div>
        ),
      } as ReactViews<ArchivableState, ArchivableTemplate>
    }
  />
);

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
        Closed: dispatch => (
          <div className="bug-row">
            <ArchivableComponent name={props.name} />
            <button onClick={() => dispatch('REOPEN')}>Reopen</button>
          </div>
        ),
      } as ReactViews<BugState, BugTemplate>
    }
  />
);
