import { cleanup, fireEvent, render, RenderResult } from 'react-testing-library';
import * as React from 'react';

import { EditiabbleInputProps, EditiableInput } from '../../examples/EditableInput';
import { applyActions, composeActions, makeAction } from '../__test__helpers__/UserActions';

const defaultValue = 'Some value';
const newValue = 'new value';

describe('EditableInput', () => {
  afterEach(cleanup);

  const click = (buttonLabel: string) =>
    makeAction(({ getByText }) => {
      fireEvent.click(getByText(buttonLabel));
    });

  it('starts in readonly mode', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('readonly').textContent).toBe(defaultValue);
  });

  it('goes to Editing mode if pressing Edit', () => {
    const { getByValue } = click('Edit')(renderComponent());
    expect(getByValue(defaultValue)).toBeDefined();
  });

  describe('from Editing', () => {
    const changeInput = (newValue: string) =>
      makeAction(({ getByValue }) => {
        fireEvent.change(getByValue(defaultValue), { target: { value: newValue } });
      });

    it('restores old value when pressing Cancel', () => {
      const { getByTestId } = applyActions(renderComponent(), [
        click('Edit'),
        changeInput('something stupid'),
        click('Cancel'),
      ]);
      expect(getByTestId('readonly').textContent).toBe(defaultValue);
    });

    const submitValue = (newValue: string) =>
      composeActions([click('Edit'), changeInput(newValue), click('Save')]);

    it('updates value when pressing Save', () => {
      const { getByTestId } = submitValue(newValue)(renderComponent());
      expect(getByTestId('readonly').textContent).toBe(newValue);
    });

    it('calls onChange when updating the value', () => {
      const onChangeSpy = jest.fn();
      submitValue(newValue)(renderComponent({ onChange: onChangeSpy }));
      expect(onChangeSpy).toHaveBeenCalledWith(newValue);
    });

    it('does not call onChange if the text has not changed', () => {
      const onChangeSpy = jest.fn();
      submitValue(defaultValue)(renderComponent({ onChange: onChangeSpy }));
      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });
});

function renderComponent(customProps: Partial<EditiabbleInputProps> = {}): RenderResult {
  const defaultProps: EditiabbleInputProps = {
    defaultValue,
    onChange: () => {},
  };

  return render(<EditiableInput {...defaultProps} {...customProps} />);
}
