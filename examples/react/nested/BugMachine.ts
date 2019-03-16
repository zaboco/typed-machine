import { DefineTemplate, Machine } from '../../../src/core/Machine';

export type BugState = 'Open' | 'Closed';
export type ArchivableState = 'Unarchived' | 'Archived';

export type BugTemplate = DefineTemplate<
  BugState,
  {
    Open: {
      transitionPayloads: {
        RESOLVE: null;
      };
      model: null;
    };
    Closed: {
      transitionPayloads: {
        REOPEN: null;
      };
      model: null;
    };
  }
>;

export type ArchivableTemplate = DefineTemplate<
  ArchivableState,
  {
    Unarchived: {
      transitionPayloads: {
        ARCHIVE: null;
      };
      model: null;
    };
    Archived: {
      transitionPayloads: {
        RESTORE: null;
      };
      model: null;
    };
  }
>;

export type BugMachine = Machine<BugState, BugTemplate>;
export type ArchivableMachine = Machine<ArchivableState, ArchivableTemplate>;

export const bugMachine: BugMachine = {
  current: 'Open',
  graph: {
    Open: {
      model: null,
      transitions: {
        RESOLVE: () => ['Closed', null],
      },
    },
    Closed: {
      model: null,
      transitions: {
        REOPEN: () => ['Open', null],
      },
    },
  },
};

export const archivableMachime: ArchivableMachine = {
  current: 'Unarchived',
  graph: {
    Unarchived: {
      model: null,
      transitions: {
        ARCHIVE: () => ['Archived', null],
      },
    },
    Archived: {
      model: null,
      transitions: {
        RESTORE: () => ['Unarchived', null],
      },
    },
  },
};
