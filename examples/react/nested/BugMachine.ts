import { DefineTemplate, Machine } from '../../../src/core/Machine';

export type BugState = 'Open' | 'Closed.Unarchived' | 'Closed.Archived';

export type BugTemplate = DefineTemplate<
  BugState,
  {
    Open: {
      transitionPayloads: {
        RESOLVE: null;
      };
      model: null;
    };
    'Closed.Unarchived': {
      transitionPayloads: {
        REOPEN: null;
        ARCHIVE: null;
      };
      model: null;
    };
    'Closed.Archived': {
      transitionPayloads: {
        REOPEN: null;
        RESTORE: null;
      };
      model: null;
    };
  }
>;

export type BugMachine = Machine<BugState, BugTemplate>;

export const bugMachine: BugMachine = {
  current: 'Open',
  graph: {
    Open: {
      model: null,
      transitions: {
        RESOLVE: () => ['Closed.Unarchived', null],
      },
    },
    'Closed.Unarchived': {
      model: null,
      transitions: {
        REOPEN: () => ['Open', null],
        ARCHIVE: () => ['Closed.Archived', null],
      },
    },
    'Closed.Archived': {
      model: null,
      transitions: {
        REOPEN: () => ['Open', null],
        RESTORE: () => ['Closed.Unarchived', null],
      },
    },
  },
};
