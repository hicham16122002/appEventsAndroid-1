import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Modal from "react-native-modal";
import DetailMarker from './DetailMarker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DetailLocal = (props) => {
  const [showDetail, setShowDetail] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setShowDetail(true);
  };

  const item = props.data;

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => toggleModal()} style={styles.button}>
          <Text style={styles.buttonText}>INFO</Text>
        </TouchableOpacity>
      </View>
      <Modal
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        onSwipeComplete={toggleModal}
        swipeDirection="down"
        propagateSwipe={true}
        animationType="none"
        style={{ margin: 0 }}
      >
        <DetailMarker data={item} show={showDetail}></DetailMarker>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: hp('2.5%'),
    alignSelf: 'center',
    zIndex: 1,
  },
  button: {
    backgroundColor: 'white',
    width: wp('30%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp('2.5%'),
  },
  buttonText: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DetailLocal;
