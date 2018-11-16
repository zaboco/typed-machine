import { cleanup, fireEvent, render, RenderResult } from 'react-testing-library';
import * as React from 'react';

import { EditiabbleInputProps, EditiableInput } from '../../examples/EditableInput';

const defaultValue = 'Some value';

describe('EditableInput', () => {
  afterEach(cleanup);

  it('starts in readonly mode', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('readonly').textContent).toBe(defaultValue);
  });

  it('goes to Editing mode if pressing Edit', () => {
    const { getByValue, getByText } = renderComponent();

    fireEvent.click(getByText('Edit'));

    expect(getByValue(defaultValue)).toBeDefined();
  });

  describe('from Editing', () => {
    it('updates value when pressing Save', () => {
      const newValue = 'new value';

      const { getByTestId } = submitValue(newValue, enableEditing(renderComponent()));

      expect(getByTestId('readonly').textContent).toBe(newValue);
    });

    it('restores old value when pressing Cancel', () => {
      const { getByValue, getByText, getByTestId } = enableEditing(renderComponent());

      fireEvent.change(getByValue(defaultValue), { target: { value: 'something stupid' } });
      fireEvent.click(getByText('Cancel'));

      expect(getByTestId('readonly').textContent).toBe(defaultValue);
    });

    it('calls onChange when updating the value', () => {
      const newValue = 'new value';
      const onChangeSpy = jest.fn();

      submitValue(newValue, enableEditing(renderComponent({ onChange: onChangeSpy })));

      expect(onChangeSpy).toHaveBeenCalledWith(newValue);
    });

    it('calls onChange callback when updating the value', () => {
      const newValue = 'new value';
      const onChangeSpy = jest.fn();

      submitValue(newValue, enableEditing(renderComponent({ onChange: onChangeSpy })));

      expect(onChangeSpy).toHaveBeenCalledWith(newValue);
    });

    it('does not call onChange if the text has not changed', () => {
      const onChangeSpy = jest.fn();

      submitValue(defaultValue, enableEditing(renderComponent({ onChange: onChangeSpy })));

      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    function enableEditing(renderResult: RenderResult): RenderResult {
      fireEvent.click(renderResult.getByText('Edit'));
      return renderResult;
    }

    function submitValue(newValue: string, rendeResult: RenderResult): RenderResult {
      fireEvent.change(rendeResult.getByValue(defaultValue), { target: { value: newValue } });
      fireEvent.click(rendeResult.getByText('Save'));
      return rendeResult;
    }
  });
});

function renderComponent(customProps: Partial<EditiabbleInputProps> = {}): RenderResult {
  const defaultProps: EditiabbleInputProps = {
    defaultValue,
    onChange: () => {},
  };

  return render(<EditiableInput {...defaultProps} {...customProps} />);
}
