import { EditableState, EditableMachine } from './SimpleEditableMachine';
import { Model } from '../../src/core/Machine';

type EditableItemDocument<S extends EditableState> = {
  id: string;
  state: S;
  model: Model<EditableMachine, S>;
};

const data = {
  '1': {
    id: '1',
    state: 'Readonly',
    model: {
      value: 'foo',
    },
  },
  '2': {
    id: '2',
    state: 'Readonly',
    model: {
      value: 'bar',
    },
  },
};

export async function getItem<S extends EditableState>(
  id: string,
): Promise<EditableItemDocument<S>> {
  return data[id];
}
