import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';

import AppText from '@src/components/AppText';
import RateSlider from '@src/screens/trackmood/components/RateSlider';
import Button from '@src/components/Button';
import FilterModal from '@src/screens/trackmood/components/FilterModal';
import StatusChart from '@src/screens/trackmood/components/StatusChart';
import EmotionBox from '@src/screens/trackmood/components/EmotionBox';
import BadMoodModal from './components/BadMoodModal';
import RecentScore from './components/RecentScore';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { styles } from '@src/screens/trackmood/styles';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { getClientMood, postClientMoode } from '@src/stores/client/thunk-actions';
import { EClientThunkActions } from '@src/stores/client/constants';
import { showErrorToast } from '@src/utils/toast-utils';
import { ArrowDownIcon } from '@src/assets/icons';
import { TTrackMood } from '@src/interfaces/trackmood-interfaces';
import {
  GreatEmotionImage,
  HappyEmotionImage,
  SadEmotionImage,
  UnHappyEmtionImage,
} from '@src/assets/images';
import { NUMBER_MILISECONDS_IN_A_DAY } from '@src/variables/constants';

interface IFormFilter {
  fromAt: string;
  toAt: string;
}

const TrackMode = () => {
  const [rate, setRate] = useState<number>(5);
  const [status, setStatus] = useState<string>('');
  const [formFilter, setFormFilter] = useState<null | IFormFilter>(null);
  const [filterMode, setFilterMode] = useState<'7' | '30' | 'custom'>('7');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [badModalVisible, setBadModalVisible] = useState<boolean>(false);
  const [chartData, setChartData] = useState<TTrackMood[]>([]);

  const dispatch = useAppDispatch();

  const { profile } = useAppSelector((state) => state.client);
  const isLoading = useAppSelector((state) => state.loading[EClientThunkActions.POST_CLIENT_MOOD]);

  const moodData = [
    {
      image: HappyEmotionImage,
      text: 'Happy',
    },
    {
      image: SadEmotionImage,
      text: '--',
    },
    {
      image: UnHappyEmtionImage,
      text: '--',
    },
    {
      image: HappyEmotionImage,
      text: '--',
    },
    {
      image: GreatEmotionImage,
      text: '--',
    },
  ];

  const handleChangeRate = (value: number) => {
    setRate(value);
  };

  const onChangeFormFilter = (data: IFormFilter) => {
    setFormFilter(data);
  };

  const handlePostClientMood = async () => {
    try {
      const body = { comment: status, flag: 1, point: rate };
      await dispatch(postClientMoode(body));
      if (rate <= 1) {
        setBadModalVisible(true);
      }
      setStatus('');
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  const handleGetClientMood = async (form: IFormFilter) => {
    try {
      const data = await dispatch(getClientMood(form));
      setChartData(data.payload);
    } catch (error) {}
  };

  useEffect(() => {
    const date = new Date();
    const data = {
      fromAt: dayjs(new Date(date.getTime() - 7 * NUMBER_MILISECONDS_IN_A_DAY)).toISOString(),
      toAt: dayjs(Date.now()).toISOString(),
    };
    handleGetClientMood(data);
  }, []);

  useEffect(() => {
    if (formFilter) {
      handleGetClientMood(formFilter);
    }
  }, [formFilter]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View>
          <AppText customStyles={styles.welcomeText}>
            Hello, <AppText customStyles={styles.blueText}>{profile?.client?.firstName}</AppText>
          </AppText>
          <AppText customStyles={styles.welcomeTitle}>How are you feeling today?</AppText>
        </View>

        <View style={styles.smallGap}>
          <AppText customStyles={styles.blockTitle}>How do you score your feelings?</AppText>
          <EmotionBox />
          <RateSlider onChangeRate={handleChangeRate} rate={rate} />
        </View>
        <View style={styles.smallGap}>
          <AppText customStyles={styles.blockTitle}>Status</AppText>
          <TextInput
            value={status}
            onChangeText={setStatus}
            editable
            multiline
            numberOfLines={5}
            placeholder="What's made you feed that way?"
            style={styles.statusInput}
          />
        </View>
        <Button
          text='Save'
          loading={isLoading}
          disabled={isLoading}
          onPress={handlePostClientMood}
        />

        <RecentScore />

        <View style={styles.mediumGap}>
          <View style={styles.chartHeader}>
            <AppText customStyles={styles.blockTitle}>Emotion tracker</AppText>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setModalVisible(true)}>
              <AppText customStyles={styles.filterBtnText}>
                {filterMode === '7'
                  ? 'Last 7 days'
                  : filterMode === '30'
                  ? 'Last 30 days'
                  : 'Custom'}
              </AppText>
              <ArrowDownIcon />
            </TouchableOpacity>
            <FilterModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              onChange={onChangeFormFilter}
              filterMode={filterMode}
              onChangeFilterMode={(mode: '7' | '30' | 'custom') => setFilterMode(mode)}
            />
          </View>
          <AppText customStyles={styles.chartTitle}>Mood</AppText>
          <StatusChart data={chartData} />
          <View style={styles.iconContainer}>
            {moodData.map((item, index) => (
              <View style={styles.iconContent} key={index}>
                <Image source={item.image} style={styles.smallIcon} />
                <AppText customStyles={styles.iconText}>{item.text}</AppText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <BadMoodModal
        modalVisible={badModalVisible}
        onCloseModalVisible={() => setBadModalVisible(false)}
      />
    </ScrollView>
  );
};

export default TrackMode;
