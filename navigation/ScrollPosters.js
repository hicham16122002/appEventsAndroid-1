import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Dimensions,
         ActivityIndicator, Image, ImageBackground, Linking, PanResponder, Animated } from 'react-native';
import Swiper from 'react-native-swiper';
import GestureRecognizer from 'react-native-swipe-gestures';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Loading from './Loading';
import ResultZero from './ResultZero';
import DetailLocal from './DetailLocal';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const ScrollPosters = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const posters = props.data;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [posters]);

  const handleImageLoaded = () => {
    setLoading(false);
  };

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleOpenGoogleMaps = (item) => {
    const destination = item.INDIRIZZO;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

    Linking.openURL(url);
  };
  
  const ModalContent = () => {
    const [swiperIndex, setSwiperIndex] = useState(selectedImageIndex);
  
    const onIndexChanged = (index) => {
      setSwiperIndex(index);
    };
  
    const currentItem = posters[swiperIndex];
  
    useEffect(() => {
      setSelectedImageIndex(swiperIndex);
    }, [swiperIndex]);
  
    return (
      <View style={styles.modalContainer}>
        <Swiper
          index={selectedImageIndex}
          loop={false}
          showsPagination={false}
          onIndexChanged={onIndexChanged}
          removeClippedSubviews={false}
        >
          {posters.map((item, index) => (
            <View key={index} style={styles.modalImageContainer}>
              <Image
                source={{ uri: item.URL + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }}
                style={styles.modalImage}
                resizeMode="stretch"
                onLoad={() => {
                  if (index === selectedImageIndex) {
                    setLoading(false);
                  }
                }}
              />
            </View>
          ))}
        </Swiper>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>Chiudi</Text>
        </TouchableOpacity>
        <DetailLocal data={currentItem}></DetailLocal>
        {/* <TouchableOpacity style={styles.infoButton}>
          <Text style={styles.infoButtonText}>INFO</Text>
        </TouchableOpacity> */}
      </View>
    );
  };
  

  const renderImageContainer = (item, index) => {
    const imageStyle = [
      styles.image,
      {
        minWidth: height > 700 ? wp('60%') : wp('55%'),
        maxWidth: wp('60%'),
        minHeight: height > 700 ? hp('47%') : hp('43%'),
      },
    ];

    const containerStyle = [
      styles.imageContainer,
      {
        marginHorizontal: wp('3%'),
        paddingTop: hp('3%'),
        marginBottom: hp('2.5%'),
        marginLeft: hp('3.5%'),
        width: height > 700 ? wp('73%') : wp('67%'),
        maxHeight: hp('71%'), // Altezza massima del contenitore
      },
    ];

    return (
      <View key={index} style={containerStyle}>
        <TouchableOpacity onPress={() => openModal(index)}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          )}
          <Image
            source={{ uri: item.URL + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }}
            style={imageStyle}
            onLoad={handleImageLoaded}
            resizeMode="stretch"
          />
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
            <ModalContent />
        </Modal>
        <View style={styles.containerInfo}>
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Image source={{ uri: item.HOME + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }} style={styles.imageHome} resizeMode="contain" />
          </View>
          <Text style={styles.informationLocal}>{item.INDIRIZZO}</Text>
          <TouchableOpacity style={styles.button}>
            <Text onPress={() => handleOpenGoogleMaps(item)} style={styles.buttonText}>APRI MAPPE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {posters && posters.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {posters.map((item, index) => renderImageContainer(item, index))}
        </ScrollView>
      ) : (
        <ResultZero />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242f3e",
    paddingTop: hp('2.5%'),
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'white',
    padding: wp('2%'),
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  image: {
    minWidth: wp('80%'),
    maxWidth: wp('80%'),
    height: 'auto',
    minHeight: hp('40%'),
    borderRadius: 20
  },
  imageHome: {
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    width: wp('50%'),
    height: hp('9%'),
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 25,
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: hp('1.6%'),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  containerInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: hp('0.5%'),
    paddingHorizontal: wp('2%'),
    marginBottom: hp('2%'),
  },
  informationLocal: {
    fontSize: hp('1.5%'),
    maxHeight: hp('4%'),
    flexWrap: 'wrap',
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalImageContainer: {
    //flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  modalImage: {
    width: Dimensions.get('window').width, // Larghezza del dispositivo
    height: Dimensions.get('window').height - hp('10%'), // Altezza del dispositivo
  },  
  closeButton: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('2%'),
    backgroundColor: 'black',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: hp('2.3%'),
    fontWeight: 'bold',
    color: 'white',
  },
  infoButton: {
    position: 'absolute',
    bottom: hp('5%'),
    width: wp('20%'),
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 20,
    zIndex: 1,
  },
  infoButtonText: {
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default ScrollPosters;
