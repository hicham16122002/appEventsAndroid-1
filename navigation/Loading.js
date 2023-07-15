import React from 'react';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Loading = ({ visible }) => {
  return (
    <Spinner
      visible={visible}
      textContent={'Caricamento in corso...'}
      textStyle={styles.spinnerText}
    />
  );
};

const styles = StyleSheet.create({
  spinnerText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Loading;
