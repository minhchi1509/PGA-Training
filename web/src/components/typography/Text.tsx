import './Text.scss';

interface ITextProps {
  className?: string;
  inline?: boolean;
  type?:
    | 'display1'
    | 'headline'
    | 'title'
    | 'subHeading'
    | 'body2'
    | 'body1'
    | 'caption'
    | 'heading'
    | 'small'
    | 'x-small'
    | 'xl'
    | 'button'
    | 'display2';
  color?: 'default' | 'error';
  textAlign?: 'left' | 'center' | 'right';
  dangerouslyText?: string;
  children?: React.ReactNode;
}

const BaseText = ({
  className,
  inline = false,
  type = 'body2',
  color = 'default',
  textAlign,
  dangerouslyText,
  children,
}: ITextProps) => {
  const TextElement = inline ? 'span' : 'div';

  if (dangerouslyText)
    return (
      <TextElement
        style={{ textAlign: textAlign ?? 'inherit' }}
        dangerouslySetInnerHTML={{ __html: dangerouslyText }}
        className={`Text ${type} dangerousText ${color !== 'default' ? color : ''} ${className ?? ''}`}
      />
    );

  return (
    <TextElement
      className={`Text ${type} ${color !== 'default' ? color : ''} ${className ?? ''}`}
      style={{ textAlign: textAlign ?? 'inherit' }}
    >
      {children}
    </TextElement>
  );
};

export default BaseText;
