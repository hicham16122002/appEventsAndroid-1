import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { db } from '../navigation/FireBaseConn';
import { ref, onValue } from 'firebase/database'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DateInputSettings = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    async function getPosters() {
      try {
        const starCountRef = ref(db, 'Eventi/');
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          const newPosts = Object.keys(data).map((key) => ({
            ...data[key],
          }));
          const listPosters = newPosts.filter(value => value.DATA === moment(currentDate).format('YYYY-MM-DD')).map(post => post.IDREF);
          onDateChange(moment(currentDate).format('YYYY-MM-DD'), listPosters);
        });
      } catch (error) {
        console.error(error);
      }
    }

    getPosters();
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 7); // Una settimana prima

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7); // Una settimana dopo

  const formattedDate = moment(date).format('DD/MM/YYYY');

  useEffect(() => {
    handleDateChange();
    onDateChange(moment(date).format('YYYY-MM-DD')); // Chiamata iniziale senza un evento di selezione della data
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker}>
        <View style={styles.label}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    backgroundColor: 'white',
    paddingVertical: hp('0.5%'),
    borderColor: 'black',
  },
  dateText: {
    fontSize: hp('2.1%'),
    color: 'black',
  },
});

export default DateInputSettings;
