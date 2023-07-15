import { SafeAreaView, StyleSheet, Text, View, Button } from 'react-native'
import React, { useState, useEffect } from 'react'

import UserLocation from '../navigation/UserLocation.js' 

const Maps = ({navigation}) => {
  return (
    <UserLocation></UserLocation>
  )
}

export default Maps

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});