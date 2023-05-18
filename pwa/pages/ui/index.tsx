import { NextPage } from 'next';
import React from 'react';
import { Title } from '../../components/common/text';
import Navbar from '../../components/layout/navbar';
import { Footer } from '../../components/layout/footer';
import { Form } from '../../components/common/form/forms';
import { InputBase, Select, Switch } from '../../components/common/input';
import { MultiSelect } from '../../components/common/input';

type uiItemProps = {
  title: string;
  className?: string;
};

const UiItem: React.FC<React.PropsWithChildren<uiItemProps>> = ({ children, className = '', title }) => (
  <div className={`py-8 px-8 rounded-lg bg-gray-200 ${className}`}>
    <h1 className="text-5xl font-bold">{title}</h1>
    <div className="divider"></div>
    {children}
  </div>
);

const Ui: NextPage = () => {
  return (
    <div className="grid px-8 gap-16">
      <UiItem title="Title page">
        <Title title="My title" />
      </UiItem>
      <UiItem title="Navbar">
        <Navbar />
      </UiItem>
      <UiItem title="Footer">
        <Footer />
      </UiItem>
      <UiItem title="Forms">
        <Form
          title="Sample form"
          inputs={[
            {
              placeholder: 'johndoe@example.com',
              label: 'mail',
              type: 'email',
            },
            {
              placeholder: 'mysecretpassword',
              label: 'password',
              type: 'password',
            },
          ]}
          buttonProps={{ text: 'example' }}
        />
      </UiItem>
      <UiItem title="Form fields" className="grid gap-4">
        <InputBase label="email" type="email" name="email" placeholder="john@doe.com" />
        <InputBase label="password" type="password" name="password" placeholder="mypassword" />
        <InputBase label="phone" type="phone" name="phone" placeholder="+33606060606" />
        <div className="flex flex-row">
          <Switch />
          <Switch defaultChecked />
        </div>
        <MultiSelect
          label="Multiple select"
          options={[
            {
              name: 'HTML',
              value: 'html',
            },
            {
              name: 'CSS',
              value: 'css',
            },
            {
              name: 'Ruby',
              value: 'ruby',
            },
          ]}
          required
        />
        <Select
          label="Simple select"
          placeholder="Choose one"
          name="simple-select"
          options={[
            {
              name: 'first',
              value: 'first',
            },
            {
              name: 'second',
              value: 'second',
            },
          ]}
        />
        <Select
          label="Multiple through simple select"
          placeholder="Choose one"
          name="simple-select"
          options={[
            {
              name: 'first',
              value: 'first',
            },
            {
              name: 'second',
              value: 'second',
            },
          ]}
          isMultiple
        />
      </UiItem>
    </div>
  );
};

export default Ui;