import { Card as AntCard, CardProps } from 'antd';

import './Card.scss';

interface IProps extends CardProps {
  alignCenterTitle?: boolean;
}

const Card = ({ className, alignCenterTitle = true, children, ...rest }: IProps) => {
  return (
    <AntCard
      className={`Card ${className ?? ''}`}
      headStyle={{ textAlign: alignCenterTitle ? 'center' : 'left' }}
      {...rest}
    >
      {children}
    </AntCard>
  );
};

export default Card;
