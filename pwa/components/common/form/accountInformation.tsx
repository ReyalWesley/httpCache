import React from 'react';
import { InlineInput } from '../input';
import { Form } from './forms';

export type AccountInformationType = {
  label: string;
  value?: string;
  type?: HTMLInputElement['type'];
  placeholder?: string;
};

const fields = [
  {
    label: 'firstname',
    placeholder: 'firstname',
    variant: 'danger',
  },
  {
    label: 'firstname',
    value: 'wesley',
    variant: 'success',
  },
  {
    label: 'firstname',
    value: 'wesley',
  },
  {
    label: 'firstname',
    value: 'wesley',
  },
];

const button = {
  text: 'save changes',
  wide: true,
};

export const AccountInformation: React.FC = () => (
  <Form buttonProps={button} title="My account">
    {fields.map((field, idx) => (
      <InlineInput {...field} key={idx} />
    ))}

    <div className="divider"></div>

    <InlineInput label="password" type="password" placeholder="mysecretpassword" />
    <InlineInput label="new password" type="password" placeholder="mynewsecretpassword" />
    <InlineInput label="confirm password" type="password" placeholder="mynewsecretpassword" />
  </Form>
);
