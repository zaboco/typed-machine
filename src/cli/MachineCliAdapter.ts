import { currentView, GraphTemplate, Machine, View, Views } from '../core/Machine';
import readline from 'readline';

export enum KeyName {
  Enter = 'return',
  Escape = 'escape',
  Backspace = 'backspace',
}

type KeyListener = (str: string | undefined, key: KeyObject) => void;

type KeyObject = {
  name: KeyName;
};

export type CliInstance = {
  output: string;
  onKeyPress: KeyListener;
};

export type CliViews<S extends string, GT extends GraphTemplate<S>> = Views<CliInstance, S, GT>;
export type CliView<S extends string, GT extends GraphTemplate<S>> = View<CliInstance, S, GT>;

export const MachineCliAdapter = <S extends string, GT extends GraphTemplate<S>>(
  initialMachine: Machine<S, GT>,
  views: CliViews<S, GT>,
) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode!(true);

  process.stdin.on('keypress', (_str, key) => {
    if (key.ctrl && key.name === 'c') {
      quit();
    }
  });

  return () => {
    let onKeyPress: KeyListener | null = null;

    render(initialMachine);

    function render(machine: Machine<S, GT>) {
      const view = currentView(machine, views, newMachine => {
        render(newMachine);
      });

      if (view.onKeyPress !== onKeyPress) {
        if (onKeyPress !== null) {
          process.stdin.removeListener('keypress', onKeyPress);
        }
        process.stdin.addListener('keypress', view.onKeyPress);
        onKeyPress = view.onKeyPress;
      }

      clearScreen();
      process.stdout.write(view.output);
      moveCursorTo(0, 0);
    }
  };
};

export function quit() {
  clearScreen();
  process.exit();
}

function clearScreen() {
  moveCursorTo(0, 0);
  readline.clearScreenDown(process.stdout);
}

export function moveCursorTo(x: number, y: number) {
  readline.cursorTo(process.stdout, x, y);
}
