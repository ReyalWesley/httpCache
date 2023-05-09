import React from 'react';
import { BlurBlock } from './blurBlock';
import { Title } from '../text';
import { BaseButton } from '../button';
import { InputBase } from '../input';

export const Register: React.FC = () => (
  <BlurBlock>
    <form action="" className="pt-10 px-16 pb-12  flex justify-center items-center flex-col gap-y-6">
      <Title title="Register" />
      <InputBase placeholder="johndoe@example.com" label="mail" type="email" />
      <InputBase placeholder="john" label="firstname" type="text" />
      <InputBase placeholder="doe" label="lastname" type="text" />
      <InputBase placeholder="vinvin corp" label="company" type="text" optional />
      <InputBase placeholder="mysecretpassword" label="password" type="password" />
      <InputBase placeholder="mysecretpassword" label="confirm password" type="password" />
      <div className="w-full flex flex-nowrap justify-between">
        <BaseButton text="register" wide />
        <BaseButton text="cancel" wide outlined />
      </div>
    </form>
  </BlurBlock>
);
