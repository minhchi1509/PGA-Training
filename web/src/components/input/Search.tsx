import { InputProps, InputRef, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { SearchIcon } from 'src/assets/icons';
import { TChangeInputEvent } from 'src/interfaces/common-interface';
import Input from './Input';
import './Search.scss';

interface IProps extends Omit<InputProps, 'onChange'> {
  className?: string;
  loading?: boolean;
  placeHolder?: string;
  width?: string;
  value?: string;
  inputRef?: React.Ref<InputRef>;
  onChange: (value: string) => void;
}

const Search = ({ className, loading, placeHolder, width = '100%', inputRef, value, onChange, ...rest }: IProps) => {
  const isControlledSearch = value !== undefined;
  const [searchValue, setSearchValue] = useState<string>('');
  const [firstRender, setFirstRender] = useState(false);

  const handleChange = (e: TChangeInputEvent) => {
    if (!isControlledSearch) {
      setSearchValue(e.target.value);
      return;
    }

    onChange(e.target.value);
  };

  useEffect(() => {
    if (isControlledSearch) return;

    const handler = setTimeout(() => {
      if (firstRender) onChange(searchValue);
    }, 500);

    return () => {
      !isControlledSearch && clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    setFirstRender(true);
  }, []);

  if (isControlledSearch)
    return (
      <Input
        className={`Search ${className ?? ''}`}
        placeholder={placeHolder ?? 'Search'}
        style={{ width }}
        value={value}
        onChange={handleChange}
        prefix={<SearchIcon />}
        suffix={loading ? <Spin /> : null}
        size="middle"
        {...rest}
      />
    );

  return (
    <Input
      ref={inputRef}
      allowClear={true}
      className={`Search ${className ?? ''}`}
      placeholder={placeHolder ?? 'Search'}
      style={{ width }}
      onChange={handleChange}
      prefix={<SearchIcon />}
      suffix={loading ? <Spin /> : null}
      size="middle"
      {...rest}
    />
  );
};

export default Search;
