import { PropsWithChildren } from 'react';
import { BaseText } from '../typography';

import './CommonContent.scss';
import { ChevronLeftIcon } from 'src/assets/icons';

interface IProps extends PropsWithChildren {
  className?: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  haveBackButton?: boolean;
  onClickToBackButton?: () => void;
}

const CommonContent = ({ className, title, action, haveBackButton, onClickToBackButton, children }: IProps) => {
  return (
    <div className={`CommonContent ${className ?? ''}`}>
      <div className="CommonContent__header">
        <div className="CommonContent__header-title">
          {haveBackButton && (
            <ChevronLeftIcon className="CommonContent__header-backBtn" onClick={() => onClickToBackButton?.()} />
          )}
          {typeof title === 'string' ? <BaseText type="display1">{title}</BaseText> : title}
        </div>
        {action && <div className="CommonContent__header-action">{action}</div>}
      </div>
      <div className="CommonContent__content">{children}</div>
    </div>
  );
};

export default CommonContent;
