import * as React from 'react';
import { cleanup, render, RenderResult } from 'react-testing-library';
import { EditableItem, EditableItemProps } from './EditableItem';
import { click, composeSteps, inputHandlerByValue, runSteps } from './__test__helpers__/Steps';
import { createEditableMachineContainer } from '../shared/EditableMachine';

const defaultValue = 'Some value';
const newValue = 'new value';

describe('EditableItem', () => {
  afterEach(cleanup);

  it('starts in readonly mode', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('readonly').textContent).toBe(defaultValue);
  });

  it('goes to Editing mode if pressing Edit', () => {
    const { getByValue } = click('Edit')(renderComponent());
    expect(getByValue(defaultValue)).toBeDefined();
  });

  describe('from Editing', () => {
    const changeInput = inputHandlerByValue(defaultValue);

    it('restores old value when pressing Cancel', () => {
      const { getByTestId } = runSteps(renderComponent(), [
        click('Edit'),
        changeInput('something stupid'),
        click('Cancel'),
      ]);
      expect(getByTestId('readonly').textContent).toBe(defaultValue);
    });

    const submitValue = (newValue: string) =>
      composeSteps([click('Edit'), changeInput(newValue), click('Save')]);

    it('updates value when pressing Save', () => {
      const { getByTestId } = submitValue(newValue)(renderComponent());
      expect(getByTestId('readonly').textContent).toBe(newValue);
    });
  });
});

function renderComponent(): RenderResult {
  const machine = createEditableMachineContainer(defaultValue);
  return render(<EditableItem machine={machine} />);
}
