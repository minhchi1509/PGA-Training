import { ReactNode } from 'react';

import './Container.scss';

interface IContainerProps {
  className?: string;
  title?: string;

  children: ReactNode;
}

const Container = ({ className, children }: IContainerProps) => {
  return (
    <div className={`Container ${className ?? ''}`}>
      <div className="Container__content">{children}</div>
    </div>
  );
};

export default Container;
