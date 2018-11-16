import { Fsm, renderCurrent } from '../Fsm';
import { ActionShape } from '../types/Actions';
import { EditableState, EditableTemplate, makeEditableFsm } from '../../examples/EditableInput';

let onChangeSpy = jest.fn();
const baseFsm = makeEditableFsm({ defaultValue: 'foo', onChange: onChangeSpy });

const mockFsm: Fsm<any, EditableState, EditableTemplate> = {
  ...baseFsm,
  graph: {
    Readonly: {
      ...baseFsm.graph.Readonly,
      render: d => d,
    },
    Editing: {
      ...baseFsm.graph.Editing,
      render: d => d,
    },
  },
};

describe('mock', () => {
  it('works', async () => {
    const readonly = makeTransition(mockFsm);
    const editing = await readonly(['START_EDITING'], (s, m) => {
      expect([s, m]).toEqual(['Editing', { draft: 'foo', previous: 'foo' }]);
    });
    const changed = await editing(['CHANGE_TEXT', 'bar'], (s, m) => {
      expect([s, m]).toEqual(['Editing', { draft: 'bar', previous: 'foo' }]);
    });

    await changed(['SAVE'], (s, m) => {
      expect([s, m]).toEqual(['Readonly', 'bar']);
      expect(onChangeSpy).toHaveBeenCalledWith('bar');
    });

    await changed(['DISCARD'], (s, m) => {
      `a`;
      expect([s, m]).toEqual(['Readonly', 'foo']);
    });
  });

  function makeTransition(fsm: any) {
    return async (action: ActionShape, cb: (s: string, m: any) => void) => {
      const dispatch = mockContainer(fsm);
      const newFsm = await dispatch(...action);
      cb(newFsm.current, currentModel(newFsm));

      return makeTransition(newFsm);
    };
  }
});

function mockContainer(fsm: any): Function {
  return function(...args: ActionShape) {
    return new Promise((resolve, reject) => {
      try {
        const handleDispatch: any = renderCurrent(fsm, ([s, m]) => {
          const newFsm = {
            current: s,
            graph: {
              ...fsm.graph,
              [s]: {
                ...fsm.graph[s],
                model: m,
              },
            },
          };
          resolve(newFsm);
        });
        handleDispatch(...args);
      } catch (e) {
        reject(e);
      }
    });
  };
}

function currentModel(fsm: Fsm<any, any, any>) {
  return fsm.graph[fsm.current].model;
}
