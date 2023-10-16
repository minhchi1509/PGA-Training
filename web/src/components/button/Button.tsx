import { ConfigProvider, Button as AntButton, ButtonProps } from 'antd';

import './Button.scss';

interface IButtonProps extends ButtonProps {
  noBorder?: boolean;
  children?: React.ReactNode;
}

const Button = ({ className, noBorder, children, ...rest }: IButtonProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextDisabled: '#ffffff',
          colorBgContainerDisabled: '#E1E6EF',
        },
      }}
    >
      <AntButton className={`Button ${className ?? ''} ${noBorder ? 'noBorder' : ''}`} {...rest}>
        {children}
      </AntButton>
    </ConfigProvider>
  );
};

export default Button;
