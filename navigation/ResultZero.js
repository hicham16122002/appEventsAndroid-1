import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ResultZero = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Non risultano eventi per il giorno selezionato</Text>
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
    marginTop: hp('20%'),
    marginLeft: wp('15%'),
    marginRight: wp('15%'),
    borderRadius: 10
  },
  text: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    //marginTop: 20,
    paddingTop: hp('2%'),
    paddingBottom: hp('2%')
  },
});

export default ResultZero;
