import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DateInput = ( {onDateChange} ) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    onDateChange(moment(currentDate).format('YYYY-MM-DD'));
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 7); // Una settimana prima

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7); // Una settimana dopo

  const formattedDate = moment(date).format('DD/MM/YYYY');

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
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.7%'),
    borderRadius: 7,
  },
  dateText: {
    fontSize: hp('2%'),
    color: 'black',
  },
});

export default DateInput;
