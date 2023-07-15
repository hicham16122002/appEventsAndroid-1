import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ResultNull = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Non risultano eventi per i prossimi giorni</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: wp('5%'),
    //marginTop: hp('1%')
  },
  text: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    //marginTop: 20,
    paddingTop: hp('1%'),
    paddingBottom: hp('1%')
  },
});

export default ResultNull;
