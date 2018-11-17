import { cleanup, render, RenderResult } from 'react-testing-library';
import * as React from 'react';

import { EditableInputProps, EditableInput } from '../../examples/EditableInput';
import {
  runInteractions,
  click,
  composeInteractions,
  inputHandlerByValue,
} from '../__test__helpers__/Interactions';

const defaultValue = 'Some value';
const newValue = 'new value';

describe('EditableInput', () => {
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
      const { getByTestId } = runInteractions(renderComponent(), [
        click('Edit'),
        changeInput('something stupid'),
        click('Cancel'),
      ]);
      expect(getByTestId('readonly').textContent).toBe(defaultValue);
    });

    const submitValue = (newValue: string) =>
      composeInteractions([click('Edit'), changeInput(newValue), click('Save')]);

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

function renderComponent(customProps: Partial<EditableInputProps> = {}): RenderResult {
  const defaultProps: EditableInputProps = {
    defaultValue,
    onChange: () => {},
  };

  return render(<EditableInput {...defaultProps} {...customProps} />);
}
