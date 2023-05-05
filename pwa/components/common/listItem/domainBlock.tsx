import React, { useState } from 'react';
import { Subdomain } from './subdomain';

type domainBlockProps = {
  number: number;
  name: string;
  configurations: subdomain[];
};

type subdomain = {
  zone: string;
  ip: string;
};

export const CollapseBlock: React.FC<domainBlockProps> = ({ number, name, configurations }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`collapse collapse-arrow border border-base-300 bg-base-100 rounded-box ${
        open ? 'collapse-open' : 'collapse-close'
      }`}
    >
      <div className="collapse-title text-xl font-medium flex justify-between px-10" onClick={() => setOpen(!open)}>
        <span>{number}</span>
        <span>{name}</span>
        <span>{configurations.length}</span>
      </div>
      <div className="collapse-content flex flex-col justify-around gap-y-4 mt-4">
        {configurations.map((subdomain, idx) => (
          <Subdomain key={idx} {...subdomain} />
        ))}
      </div>
    </div>
  );
};
