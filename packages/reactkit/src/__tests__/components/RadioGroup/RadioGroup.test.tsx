import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RadioGroup } from '../../../components/RadioGroup/RadioGroup';
import { Radio } from '../../../components/Radio/Radio';

expect.extend(toHaveNoViolations);

describe('RadioGroup', () => {
  it('renders a fieldset with radio options', () => {
    render(
      <RadioGroup name="fruit" legend="Pick a fruit">
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
      </RadioGroup>,
    );
    expect(screen.getByRole('group', { name: 'Pick a fruit' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('applies default classes', () => {
    const { container } = render(
      <RadioGroup name="g">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveClass('akds-radio-group');
    expect(fieldset).toHaveClass('akds-radio-group--vertical');
  });

  it('applies horizontal orientation class', () => {
    const { container } = render(
      <RadioGroup name="g" orientation="horizontal">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    expect(container.querySelector('fieldset')).toHaveClass('akds-radio-group--horizontal');
  });

  it('applies disabled class and disables all radios', () => {
    const { container } = render(
      <RadioGroup name="g" disabled>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(container.querySelector('fieldset')).toHaveClass('akds-radio-group--disabled');
    screen.getAllByRole('radio').forEach(radio => expect(radio).toBeDisabled());
  });

  it('propagates name to child Radio inputs', () => {
    render(
      <RadioGroup name="colors">
        <Radio value="red" label="Red" />
        <Radio value="blue" label="Blue" />
      </RadioGroup>,
    );
    screen.getAllByRole('radio').forEach(radio =>
      expect(radio).toHaveAttribute('name', 'colors'),
    );
  });

  it('marks the matching radio as checked when value is set', () => {
    render(
      <RadioGroup name="fruit" value="banana" onChange={() => {}}>
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Apple' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();
  });

  it('calls onChange when a radio option is selected', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup name="fruit" value="apple" onChange={onChange}>
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Banana' }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the fieldset element', () => {
    const ref = React.createRef<HTMLFieldSetElement>();
    render(
      <RadioGroup ref={ref} name="g">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(
        <RadioGroup name="fruit" legend="Pick a fruit">
          <Radio value="apple" label="Apple" />
          <Radio value="banana" label="Banana" />
        </RadioGroup>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(
        <RadioGroup name="fruit" legend="Pick a fruit" disabled>
          <Radio value="apple" label="Apple" />
          <Radio value="banana" label="Banana" />
        </RadioGroup>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
