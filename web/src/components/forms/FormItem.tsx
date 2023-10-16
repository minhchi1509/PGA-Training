import { Form, FormItemProps } from 'antd';

import './FormItem.scss';

interface IFormItemProps extends FormItemProps {
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  showRequiredMark?: boolean;
}

const FormItem = ({
  children,
  className,
  label,
  leftLabel,
  rightLabel,
  required = false,
  showRequiredMark = true,
  ...rest
}: IFormItemProps) => {
  return (
    <Form.Item
      className={`FormItem ${className ?? ''} ${rightLabel ? 'FormItem__has-right' : ''} ${
        !showRequiredMark && 'FormItem_hide-required-mark'
      }`}
      label={
        label ? (
          label
        ) : leftLabel || rightLabel ? (
          <>
            {typeof leftLabel === 'string' ? (
              <span className={required ? `FormItem__left-label` : ''}>{leftLabel}</span>
            ) : (
              leftLabel
            )}
            {typeof rightLabel === 'string' ? <span className="rightLabel">{rightLabel}</span> : rightLabel}
          </>
        ) : null
      }
      {...rest}
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
