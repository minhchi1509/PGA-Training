import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

import { styles } from '@src/screens/notification/styles';
import { AvatarImage, TaskImage } from '@src/assets/images';
import AppText from '@src/components/AppText';

const Notification = () => {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.notificationContainer}>
        <View>
          <View style={styles.smallGap}>
            <AppText customStyles={styles.title}>Today</AppText>
            <TouchableOpacity style={styles.notifitionItem}>
              <Image style={styles.avatar} source={AvatarImage} />
              <View style={styles.notificationItemContainer}>
                <AppText>
                  <AppText customStyles={styles.notificationText}>
                    You have been relocated to practitioner
                  </AppText>{' '}
                  <AppText customStyles={styles.notificationTextBold}>Ralph Edwards</AppText>
                </AppText>
                <AppText customStyles={styles.notificationTime}>8:15</AppText>
              </View>
              <View style={styles.notificationDot}></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifitionItem}>
              <Image style={styles.avatar} source={AvatarImage} />
              <View style={styles.notificationItemContainer}>
                <AppText>
                  <AppText customStyles={styles.notificationText}>
                    You have been relocated to practitioner
                  </AppText>{' '}
                  <AppText customStyles={styles.notificationTextBold}>Ralph Edwards</AppText>
                </AppText>
                <AppText customStyles={styles.notificationTime}>8:15</AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifitionItem}>
              <Image style={styles.avatar} source={AvatarImage} />
              <View style={styles.notificationItemContainer}>
                <AppText>
                  <AppText customStyles={styles.notificationTextBold}>Albert Flores</AppText>{' '}
                  <AppText customStyles={styles.notificationText}>sent you a message</AppText>
                </AppText>
                <AppText customStyles={styles.notificationTime}>8:15</AppText>
              </View>
              <View style={styles.notificationDot}></View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.smallGap}>
            <AppText customStyles={styles.title}>Ealier</AppText>
            <TouchableOpacity style={styles.notifitionItem}>
              <Image style={styles.avatar} source={TaskImage} />
              <View style={styles.notificationItemContainer}>
                <AppText>
                  <AppText customStyles={styles.notificationText}>
                    You have been relocated to practitioner
                  </AppText>{' '}
                  <AppText customStyles={styles.notificationTextBold}>Ralph Edwards</AppText>
                </AppText>
                <AppText customStyles={styles.notificationTime}>8:15</AppText>
              </View>
              <View style={styles.notificationDot}></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifitionItem}>
              <Image style={styles.avatar} source={AvatarImage} />
              <View style={styles.notificationItemContainer}>
                <AppText>
                  <AppText customStyles={styles.notificationText}>
                    You have been relocated to practitioner
                  </AppText>{' '}
                  <AppText customStyles={styles.notificationTextBold}>Ralph Edwards</AppText>
                </AppText>
                <AppText customStyles={styles.notificationTime}>8:15</AppText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notifitionItem}>
              <Image style={styles.avatar} source={AvatarImage} />
              <View style={styles.notificationItemContainer}>
                <AppText>
                  <AppText customStyles={styles.notificationTextBold}>Albert Flores</AppText>{' '}
                  <AppText customStyles={styles.notificationText}>sent you a message</AppText>
                </AppText>
                <AppText customStyles={styles.notificationTime}>8:15</AppText>
              </View>
              <View style={styles.notificationDot}></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Notification;
