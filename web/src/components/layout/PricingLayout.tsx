import React from 'react';
import { Logo } from 'src/assets/icons';
import { BaseText } from '../typography';

import './PricingLayout.scss';

interface IPricingLayoutProps {
  headerText: string;
  children: React.ReactNode;
  containerClassName?: string;
  contentClassname?: string;
  headerClassName?: string;
}

const PricingLayout = ({
  children,
  headerText,
  containerClassName = '',
  headerClassName = '',
  contentClassname = '',
}: IPricingLayoutProps) => {
  return (
    <div className={`pricing-container ${containerClassName}`}>
      <div className={`header ${headerClassName}`}>
        <Logo />
        <BaseText inline={false} type="heading">
          {headerText}
        </BaseText>
      </div>
      <div className={`content ${contentClassname}`}>{children}</div>
    </div>
  );
};

export default PricingLayout;
