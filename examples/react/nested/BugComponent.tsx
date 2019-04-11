import * as React from 'react';
import { MachineAdapter, ReactViews } from '../../../src/react';
import {
  ArchivableMachine,
  ArchivableState,
  ArchivableTemplate,
  bugMachine,
  BugState,
  BugTemplate,
} from './BugMachine';
import './BugComponent.css';

const ArchivableComponent = (props: { name: string; archivableMachine: ArchivableMachine }) => (
  <MachineAdapter
    machine={props.archivableMachine}
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
  <MachineAdapter
    machine={bugMachine}
    views={
      {
        Open: dispatch => (
          <div className="bug-row">
            <div style={{ color: 'red' }}>{props.name}</div>
            <button onClick={() => dispatch('RESOLVE')}>Resolve</button>
          </div>
        ),
        Closed: (dispatch, archivableMachine) => (
          <div className="bug-row">
            <ArchivableComponent name={props.name} archivableMachine={archivableMachine} />
            <button onClick={() => dispatch('REOPEN')}>Reopen</button>
          </div>
        ),
      } as ReactViews<BugState, BugTemplate>
    }
  />
);
