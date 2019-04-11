import { machineFactory, DefineTemplate, Machine } from '../../src/core/Machine';

export type EditableState = 'Readonly' | 'Editing';

export enum Msg {
  START_EDITING = 'START_EDITING',
  CHANGE_TEXT = 'CHANGE_TEXT',
  SAVE = 'SAVE',
  DISCARD = 'DISCARD',
}

export type EditableTemplate = DefineTemplate<
  EditableState,
  {
    Readonly: {
      transitionPayloads: {
        [Msg.START_EDITING]: null;
      };
      model: string;
    };
    Editing: {
      transitionPayloads: {
        [Msg.CHANGE_TEXT]: string;
        [Msg.SAVE]: null;
        [Msg.DISCARD]: null;
      };
      model: { original: string; draft: string };
    };
  }
>;

export type EditableMachineContainer = Machine<EditableState, EditableTemplate>;

export const initEditableMachine = machineFactory<EditableState, EditableTemplate>({
  Readonly: {
    START_EDITING: value => ['Editing', { draft: value, original: value }],
  },
  Editing: {
    SAVE: ({ draft }) => {
      return ['Readonly', draft];
    },
    DISCARD: ({ original }) => ['Readonly', original],
    CHANGE_TEXT: ({ original }, newDraft) => ['Editing', { original, draft: newDraft }],
  },
});
