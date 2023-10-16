import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import AppText from '@src/components/AppText';
import { Slider } from '@rneui/themed';
import { debounce } from 'lodash';

import theme from '@src/themes';
import { rateSliderStyles } from './styles';

interface IProps {
  rate: number;
  onChangeRate: (rate: number) => void;
}

const RateSlider = (props: IProps) => {
  const { onChangeRate } = props;
  const [value, setValue] = useState(50);

  useEffect(() => {
    const debouncedApiCall = debounce(() => {
      onChangeRate(+(value / 10).toFixed());
    }, 100);

    const timeoutId = setTimeout(() => {
      debouncedApiCall();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      debouncedApiCall.cancel();
    };
  }, [value]);

  return (
    <View style={rateSliderStyles.container}>
      <AppText customStyles={rateSliderStyles.title}>I need to reach out for support</AppText>
      <Slider
        value={value}
        onValueChange={(v) => setValue(v)}
        maximumValue={100}
        minimumValue={0}
        step={1}
        trackStyle={rateSliderStyles.track}
        minimumTrackTintColor={theme.colors.primaryColor}
        maximumTrackTintColor='white'
        allowTouchTrack
        thumbStyle={rateSliderStyles.thumbStyle}
        thumbProps={{
          children: (
            <View style={rateSliderStyles.thumbContainer}>
              <View style={rateSliderStyles.thumbContent}>
                <AppText customStyles={rateSliderStyles.thumbText}>
                  {(value / 10).toFixed()}
                </AppText>
              </View>
            </View>
          ),
        }}
      />
    </View>
  );
};

export default RateSlider;
