import React, { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import dayjs from 'dayjs';

import DateTimePicker from '@src/components/DateTimePicker';
import AppText from '@src/components/AppText';
import theme from '@src/themes';
import { filterModalStyles } from './styles';
import { CalenderIcon } from '@src/assets/icons';
import { NUMBER_MILISECONDS_IN_A_DAY } from '@src/variables/constants';

interface IFormFilter {
  fromAt: string;
  toAt: string;
}

interface IProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (data: IFormFilter) => void;
  filterMode: '7' | '30' | 'custom';
  onChangeFilterMode: (mode: '7' | '30' | 'custom') => void;
}

const FilterModal = (props: IProps) => {
  const { modalVisible, setModalVisible, onChange, filterMode, onChangeFilterMode } = props;
  const date = new Date();

  const [fromDate, setFromDate] = useState<string>(date.toISOString());
  const [toDate, setToDate] = useState<string>(date.toISOString());

  const onSubmit = () => {
    switch (filterMode) {
      case '30':
        const data30 = {
          fromAt: dayjs(new Date(date.getTime() - 30 * NUMBER_MILISECONDS_IN_A_DAY)).toISOString(),
          toAt: dayjs(Date.now()).toISOString(),
        };
        onChange(data30);
        break;
      case '7':
        const data7 = {
          fromAt: dayjs(new Date(date.getTime() - 7 * NUMBER_MILISECONDS_IN_A_DAY)).toISOString(),
          toAt: dayjs(Date.now()).toISOString(),
        };
        onChange(data7);
        break;
      case 'custom':
        const dataCustom = {
          fromAt: fromDate,
          toAt: toDate,
        };
        onChange(dataCustom);
        break;
      default:
    }
  };

  return (
    <Modal visible={modalVisible} animationType='fade' transparent>
      <View style={filterModalStyles.modalContainer}>
        <View style={filterModalStyles.container}>
          <AppText customStyles={filterModalStyles.title}>Progress</AppText>
          <TouchableOpacity onPress={() => onChangeFilterMode('7')}>
            <View style={filterModalStyles.radioGroup}>
              <RadioButton
                color={theme.colors.lightGreen}
                value='7'
                status={filterMode === '7' ? 'checked' : 'unchecked'}
                onPress={() => onChangeFilterMode('7')}
              />
              <AppText>Last 7 days</AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChangeFilterMode('30')}>
            <View style={filterModalStyles.radioGroup}>
              <RadioButton
                color={theme.colors.lightGreen}
                value='30'
                status={filterMode === '30' ? 'checked' : 'unchecked'}
                onPress={() => onChangeFilterMode('30')}
              />
              <AppText>Last 30 days</AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChangeFilterMode('custom')}>
            <View style={filterModalStyles.radioGroup}>
              <RadioButton
                color={theme.colors.lightGreen}
                value='custom'
                status={filterMode === 'custom' ? 'checked' : 'unchecked'}
                onPress={() => onChangeFilterMode('custom')}
              />
              <AppText>Custom</AppText>
            </View>
          </TouchableOpacity>

          <View style={filterModalStyles.datePickerContainer}>
            <DateTimePicker
              value={new Date(fromDate)}
              leftLabel='From'
              customContainerStyle={{ flex: 1 }}
              prefixIcon={<CalenderIcon />}
              format='DD/MM/YYYY'
              onDateChange={(date) => setFromDate(date.toISOString())}
              pickerMode='date'
              disabled={filterMode !== 'custom'}
              maximumDate={toDate ? new Date(toDate) : undefined}
            />
            <DateTimePicker
              value={new Date(toDate)}
              leftLabel='To'
              customContainerStyle={{ flex: 1 }}
              prefixIcon={<CalenderIcon />}
              format='DD/MM/YYYY'
              onDateChange={(date) => setToDate(date.toISOString())}
              pickerMode='date'
              disabled={filterMode !== 'custom'}
              minimumDate={fromDate ? new Date(fromDate) : undefined}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity
              style={filterModalStyles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <AppText>Close</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={filterModalStyles.saveButton}
              onPress={() => {
                onSubmit();
                setModalVisible(false);
              }}
            >
              <AppText customStyles={filterModalStyles.whiteColor}>OK</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
