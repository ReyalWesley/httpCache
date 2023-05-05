//import { AllowedIcons} from '../icon';
import React from 'react';

type AllowedVariantPopup = 'alert-success' | 'alert-danger' | 'alert-info' | 'alert-warning';

type popupProps = {
  //iconName: AllowedIcons;
  text: string;
  variant: AllowedVariantPopup;
};

export const Popup: React.FC<popupProps> = ({ text, variant }) => (
  <div className={`alert ${variant}`}>
    <div>
      <span>{text}</span>
    </div>
  </div>
);
