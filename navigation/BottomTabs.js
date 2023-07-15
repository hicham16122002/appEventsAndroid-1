import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Appearance, useColorScheme } from 'react-native';

import Maps from '../screens/Maps.js';
import Posters from '../screens/Posters.js';
import Personal from '../screens/Personal.js';
import Contacts from '../screens/Contacts.js';
import Settings from '../screens/Settings.js';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const BottomTabs = () => {
  const [selectedItem, setSelectedItem] = useState('Mappa');
  let userLoc = false;
  let colorScheme = useColorScheme();

  const handleMenuItemPress = (item) => {
    setSelectedItem(item);
  };

  let content = null;

  if (selectedItem === 'Mappa') {
    content = <Maps user={userLoc}/>;
  } else if (selectedItem === 'Locandine') {
    userLoc = false;
    content = <Posters />;
  } else if (selectedItem === 'Settings') {
    userLoc = false;
    content = <Settings />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {content}
      </View>
      <View style={{ backgroundColor: colorScheme === 'light' ? '#F5F5F5' : '#000', height: height > 700 ? hp('6.5%') : hp('9%') }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: wp('2%') }}>
          <TouchableOpacity onPress={() => handleMenuItemPress('Mappa')}>
            <Image source={require("../assets/maps-and-flags.png")} style={{width: wp('8%'), height: height > 700 ? hp('4%') : hp('5%'), top: hp('0.5%'), tintColor: selectedItem === 'Mappa' ? (colorScheme === 'dark' ? 'orange' : 'black') : 'gray'}}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('Locandine')}>
            <Image source={require("../assets/calendar.png")} style={{width: wp('10%'), height: height > 700 ? hp('4.5%') : hp('5.5%'), tintColor: selectedItem === 'Locandine' ? (colorScheme === 'dark' ? 'orange' : 'black') : 'gray'}}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('Settings')}>
            <Image source={require("../assets/settings.png")} style={{width: wp('10%'), height: height > 700 ? hp('4.5%') : hp('5.5%'), tintColor: selectedItem === 'Settings' ? (colorScheme === 'dark' ? 'orange' : 'black') : 'gray'}}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default BottomTabs

const styles = StyleSheet.create({})