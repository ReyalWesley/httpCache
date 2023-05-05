import React, { useContext, useState } from 'react';
import { Popup } from '../components/common/popup';

type AllowedVariant = 'success' | 'danger' | 'info' | 'warning';

type toastContextType = {
  text: string;
  variant: AllowedVariant;
};

const ToastContext = React.createContext<(toast: toastContextType) => void>((toast: toastContextType) => {
  return;
});

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toastList, setToastList] = useState<toastContextType[]>([]);

  return (
    <ToastContext.Provider
      value={(toast) => {
        setToastList([...toastList, toast]);
        setTimeout(() => {
          setToastList((prevToastList) => prevToastList.slice(1));
        }, 3000);
        setTimeout(() => {
          setToastList([...toastList.slice(1)]);
        }, 3000);
      }}
    >
      <div className="toast toast-top toast-end">
        {toastList.map((toast, idx) => (
          <Popup {...toast} variant={`alert-${toast.variant}`} key={idx} />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};

export const usePushToast = () => {
  return useContext(ToastContext);
};
