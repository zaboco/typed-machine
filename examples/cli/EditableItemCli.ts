import * as c from 'colorette';
import {
  CliView,
  KeyName,
  MachineCliAdapter,
  moveCursorTo,
  quit,
} from '../../src/cli/MachineCliAdapter';
import {
  EditableMachineOptions,
  EditableTemplate,
  makeEditableMachine,
} from '../react/EditableMachine';
import { ReactView } from '../../src/react';
import readline from 'readline';

const moveCursorAtTheEnd = (text: string) => {
  moveCursorTo(text.length + 9, 1);
};

const readonlyView: CliView<'Readonly', EditableTemplate> = (dispatch, model) => {
  return {
    output: `
  ${c.cyan('Value:')} ${c.bold(model)}
  
  Press ${c.yellow('E')} to Edit, ${c.red('Q')} to Quit. 
    `,
    onKeyPress: str => {
      if (!str) {
        return;
      }
      if (str.toLowerCase() === 'e') {
        dispatch('START_EDITING');
        moveCursorAtTheEnd(model);
      } else if (str.toLowerCase() === 'q') {
        quit();
      }
    },
  };
};

const editingView: CliView<'Editing', EditableTemplate> = (dispatch, { draft }) => {
  const updateText = (newText: string) => {
    dispatch('CHANGE_TEXT', newText);
    moveCursorAtTheEnd(newText);
  };

  return {
    output: `
  ${c.cyan('Value:')} ${c.bold(c.bgYellow(draft))}
  
  ${c.bgGreen('Enter')} to save
  ${c.bgRed('Esc')} to discard
    `,
    onKeyPress: (str, key) => {
      if (key.name === KeyName.Enter) {
        dispatch('SAVE');
      } else if (key.name === KeyName.Escape) {
        dispatch('DISCARD');
      } else if (key.name === KeyName.Backspace) {
        updateText(`${draft.slice(0, -1)}`);
      } else if (str) {
        updateText(`${draft}${str}`);
      }
    },
  };
};

export const EditableItemCli = (options: EditableMachineOptions) => {
  return MachineCliAdapter(makeEditableMachine(options), {
    Readonly: readonlyView,
    Editing: editingView,
  });
};
