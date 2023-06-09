import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { SimpleCard } from '../card';

type tabProps = {
  name: string;
  TabItem: React.ReactNode;
};

type tabbarProps = {
  className?: string;
  defaultTab?: number;
  tabs: ReadonlyArray<tabProps>;
};

export const Tabbar: React.FC<tabbarProps> = ({ className = '', defaultTab = 0, tabs }) => {
  const [selected, setSelected] = useState(defaultTab);
  const tabNames = useMemo(() => tabs.map((tab) => tab.name), [tabs]);
  const TabItem = useMemo(() => tabs[selected].TabItem, [tabs, selected]);

  return (
    <>
      <div className={`tabs ${className}`}>
        {tabNames.map((name, index) => (
          <Link
            href="#"
            onClick={() => {
              setSelected(index);
            }}
            key={index}
            className={`tab tab-lg tab-lifted ${index === selected ? 'tab-active' : ''}`}
          >
            <span className="text-xl">{name}</span>
          </Link>
        ))}
      </div>
      <div className="bg-base-200/50 p-8 rounded-tr-xl rounded-br-xl rounded-bl-xl">{TabItem}</div>
    </>
  );
};
