import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Radio, Modal, Space } from 'antd';

import './TimePeriod.scss';
import { TFilter, validateFilterDate } from '../util';
import Button from 'src/components/button';
import DatePicker from 'src/components/date-picker';
import { BaseText } from 'src/components/typography';
import { ETimePeriodTracker } from 'src/variables/enum-variables';

interface ITimePeriodProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: TFilter) => void;
  value: TFilter;
}

const TimePeriod = ({ isOpen, value, onClose, onSubmit }: ITimePeriodProps) => {
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [filter, setFilter] = useState<TFilter>({
    type: ETimePeriodTracker.SEVEN_DAY,
    startDate: null,
    endDate: null,
  });

  const onChangeType = (type: string) => {
    setFilter({
      ...filter,
      type,
    });
  };

  const handleSubmit = () => {
    if (filter.type === ETimePeriodTracker.CUSTOM) {
      const isValid = validateFilterDate(filter.startDate, filter.endDate);
      if (typeof isValid === 'string') {
        setErrorMsg(isValid);
        return;
      }
    }

    onSubmit(filter);
  };

  useEffect(() => {
    setFilter(value);
  }, []);

  return (
    <Modal
      open={isOpen}
      className="TimePeriodModal"
      onCancel={onClose}
      centered
      closable={false}
      footer={null}
      width={370}
    >
      <Space direction="vertical" className="TimePeriodModal__container">
        <BaseText type="title" className="TimePeriodModal__title">
          Time period
        </BaseText>
        <Radio
          onChange={() => onChangeType(ETimePeriodTracker.SEVEN_DAY)}
          checked={filter.type === ETimePeriodTracker.SEVEN_DAY}
        >
          <BaseText type="body1">Last 7 days</BaseText>
        </Radio>
        <Radio
          onChange={() => onChangeType(ETimePeriodTracker.MONTH)}
          checked={filter.type === ETimePeriodTracker.MONTH}
        >
          <BaseText type="body1">Last 30 days</BaseText>
        </Radio>
        <Radio
          onChange={() => onChangeType(ETimePeriodTracker.CUSTOM)}
          checked={filter.type === ETimePeriodTracker.CUSTOM}
        >
          <BaseText type="body1">Custom</BaseText>
        </Radio>
        {filter.type === ETimePeriodTracker.CUSTOM ? (
          <div>
            <div className="TimePeriodModal__date">
              <div className="TimePeriodModal__date--item">
                <BaseText type="caption" className="TimePeriodModal__date--item-label">
                  From
                </BaseText>
                <DatePicker
                  placeholder="-- / -- / ----"
                  disabledDate={(date) => date.isAfter(new Date())}
                  value={filter.startDate ? dayjs(filter.startDate) : null}
                  onChange={(time) => setFilter({ ...filter, startDate: time })}
                />
              </div>
              <div className="TimePeriodModal__date--item">
                <BaseText type="caption" className="TimePeriodModal__date--item-label">
                  To
                </BaseText>
                <DatePicker
                  placeholder="-- / -- / ----"
                  disabledDate={(date) => date.isAfter(new Date())}
                  value={filter.endDate ? dayjs(filter.endDate) : null}
                  onChange={(time) => setFilter({ ...filter, endDate: time })}
                />
              </div>
            </div>
            {errorMsg && (
              <BaseText type="caption" color="error" textAlign="center" className="TimePeriodModal__errorMsg">
                {errorMsg}
              </BaseText>
            )}
          </div>
        ) : null}
        <Button type="primary" block onClick={handleSubmit} className="TimePeriodModal__submit">
          Ok
        </Button>
      </Space>
    </Modal>
  );
};

export default TimePeriod;
