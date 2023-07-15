import { SafeAreaView, StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateInput from '../navigation/DateInput';
import ScrollPosters from '../navigation/ScrollPosters';
import { db } from '../navigation/FireBaseConn';
import { ref, onValue } from 'firebase/database';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Posters = ({ navigation }) => {
  const { height } = Dimensions.get('window');
  const [posters, setPosters] = useState(null);
  const scrollPostersHeight = hp('71%');
  const menuHeight = hp('11%');
  const containerHeight = height - scrollPostersHeight - menuHeight;

  async function getPosters(date) {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const paramData = date ? date : formattedDate;

      const starCountRef = ref(db, 'Eventi/');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const newPosts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        let listEvents = [];
        newPosts.map((item, index) => {
          if (item.DATA == paramData) {
            listEvents.push(item);
          }
        });
        setPosters(listEvents);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleDateChange = (date) => {
    getPosters(date);
  };

  useEffect(() => {
    getPosters();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { height: containerHeight }]}>
        <Text style={styles.title}>PROSSIMI EVENTI</Text>
        <DateInput onDateChange={handleDateChange} />
        <Text style={styles.titlePoster}>LOCANDINE</Text>
      </View>
      <ScrollPosters data={posters} style={{ height: scrollPostersHeight }} />
    </SafeAreaView>
  );
};

export default Posters;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#242f3e",
  },
  container: {
    backgroundColor: "#242f3e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: hp('4%'),
    paddingBottom: hp('1.5%'),
  },
  titlePoster: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: hp('3%'),
    top: hp('1.2%'),
  },
});
