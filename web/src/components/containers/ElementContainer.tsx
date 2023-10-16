import React from 'react';
import { BaseText } from '../typography';

import './ElementContainer.scss';

interface IProps {
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ElementContainer = ({ leftLabel, rightLabel, className = '', children }: IProps) => {
  return (
    <div className={`ElementContainer ${className}`}>
      <div className="ElementContainer__label">
        {leftLabel && (
          <BaseText type="caption" className="ElementContainer__label-leftLabel">
            {leftLabel}
          </BaseText>
        )}
        {rightLabel && (
          <BaseText type="caption" className="ElementContainer__label-rightLabel">
            {rightLabel}
          </BaseText>
        )}
      </div>
      {children}
    </div>
  );
};

export default ElementContainer;
