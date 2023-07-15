import { SafeAreaView, Dimensions, StyleSheet, Text, View, Button, StatusBar, Image, PanResponder, Animated, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import React, {useState, useEffect, useRef} from 'react';
import MapView, { Marker } from 'react-native-maps';
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DetailMarker from './DetailMarker';
import { db } from './FireBaseConn';
import { ref, onValue } from 'firebase/database'
import "firebase/storage";
import * as firebase from 'firebase/app';
import storage from '@react-native-firebase/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { height } = Dimensions.get('window');
const MODAL_HEIGHT = hp('80%');
let mapCentered = false;

export default function App(props) {
  const [mapRegion, setMapRegion] = useState({
    latitude: 45.438618,
    longitude: 10.993313,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // const [mapRegion, setMapRegion] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [check, setCheck] = useState(null);
  const [checkCopy, setCheckCopy] = useState(null);
  const [city, setCity] = useState(null);
  const [cityCopy, setCityCopy] = useState(null);
  const [data, setData] = useState([]);
  const [pan] = useState(new Animated.ValueXY());
  const [zooming, setZooming] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const modalRef = useRef(null);
  const [previousZoom, setPreviousZoom] = useState(null);
  const [createdPinlocator, setCreatedPinlocator] = useState(false);
  const [userLocationActive, setUserLocationActive] = useState(props.user);

  const handleZoomEvent = (event) => {
    const { zoom } = event;
    if (previousZoom !== null){
      if (event.latitudeDelta >= 5 || event.longitudeDelta >= 3.9){
        setCity(cityCopy);
        if (city && city.length > 0){
          let tempCity = city;

          tempCity = city.map((item, index) => {
            const nameIcon = check.length.toString();
            item.ICONA = item.ICONA.replace('{pinlocator}', 'pin-locator_' + nameIcon.padStart(2, '0'));
            return item; // Restituisci il nuovo valore nell'iterazione corrente
          });
          setCreatedPinlocator(true);
          setCity(tempCity);
          setCheck(city);
        }
        
      } else if (event.latitudeDelta < 5 && event.longitudeDelta < 3.9){
        setCreatedPinlocator(false);
        setCheck(checkCopy);
      }
    }
    setPreviousZoom(zoom);
  }

  useEffect(() => {
    async function getLocals() {
      try {
        const starCountRef = ref(db, 'Locali/');

        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          let newPosts = Object.keys (data).map(key => ({
            id:key,
            ...data[key]
          }));

          setCheck(newPosts.filter(item => item.TIPO === "LOCALE"));
          setCheckCopy(newPosts.filter(item => item.TIPO === "LOCALE"));
          setCity(newPosts.filter(item => item.TIPO === "CITY"));
          setCityCopy(newPosts.filter(item => item.TIPO === "CITY"));
        });
      } catch (error) {
        console.error(error);
      }
    }

    const animateModal = () => {
      if (isModalVisible) {
        Animated.spring(modalTranslateY, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(modalTranslateY, {
          toValue: MODAL_HEIGHT,
          useNativeDriver: false,
        }).start();
      }
    };

    animateModal();
    getLocals();
    if (!mapCentered || !userLocationActive) {
      mapCentered = true;
      animateModal();
      userLocation();
    }
    
  }, [isModalVisible]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const [selectedMarker, setSelectedMarker] = useState(null);
  const modalTranslateY = useState(new Animated.Value(MODAL_HEIGHT))[0];
  const [panResponder, setPanResponder] = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) {
          modalTranslateY.setValue(dy);
        }
      },
      onPanResponderRelease: (_, { dy }) => {
        const dismissThreshold = MODAL_HEIGHT * 0.35; // 25% dell'altezza del modal
      
        if (dy > dismissThreshold) {
          closeModal();
        } else {
          Animated.spring(modalTranslateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  );

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted"){
      setErrorMsg('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    });
    setUserLocationActive(true);
  }

  const handleMarkerPress = (marker) => {
    if (!createdPinlocator) {
      setData(marker);
      setSelectedMarker(marker);
      setModalVisible(true);
    } else if (createdPinlocator) {
      setCreatedPinlocator(false);
      setMapRegion((prevRegion) => ({
        ...prevRegion,
        latitude: prevRegion.latitude + 0.000001, // Modifica leggermente la latitudine
      }));
  
      setTimeout(() => {
        setMapRegion({
          latitude: 45.438618,
          longitude: 10.993313,
          latitudeDelta: 0.2,
          longitudeDelta: 0.17,
        });
      }, 0);
    }
  };
  
  const modalTranslateYInterpolate = modalTranslateY.interpolate({
    inputRange: [0, MODAL_HEIGHT],
    outputRange: [0, MODAL_HEIGHT],
    extrapolate: 'clamp',
  });

  const modalAnimatedStyle = {
    transform: [{ translateY: modalTranslateYInterpolate }],
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        region={mapRegion}
        customMapStyle={mapStyle}
        showsMyLocationButton= {true}
        showsUserLocation= {true}
        tracksViewChanges={false}
        provider="google"
        loadingEnabled={true}
        onRegionChange={handleZoomEvent}
      >
        {check ? 
            check.map((item, index) => {
              return (<Marker
              key={item.ID}
              coordinate={{
                latitude: parseFloat(item.LATITUDINE),
                longitude: parseFloat(item.LONGITUDINE)
              }}
              image={{uri: item.ICONA + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }}
              onPress={() => handleMarkerPress(item)}
            >              
            </Marker>)
            })
          : ('')}
            <View style={styles.flexView}>
                <StatusBar />
                <Modal
                    onBackdropPress={() => setModalVisible(false)}
                    onBackButtonPress={() => setModalVisible(false)}
                    isVisible={isModalVisible}
                    onRequestClose={closeModal}
                    //swipeDirection="down"
                    //onSwipeComplete={toggleModal}
                    // swipeDirection="down"
                    propagateSwipe={true}
                    animationType="none"
                    //transparent={false}
                    //scrollable={true}
                    //transparent={false}
                    style={styles.modal}
                >
                  <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeModal}>
                    <Animated.View style={[styles.modalContent, modalAnimatedStyle]} {...panResponder.panHandlers}>
                      <DetailMarker data={data}></DetailMarker>
                    </Animated.View>
                  </TouchableOpacity>
                </Modal>
            </View>
      </MapView>
    </View>
  )
 
}

  const mapStyle = [
    {elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    }
  ]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - hp('6%'),
    bottom: 0
  },
  flexView: {
    flex: 1,
    backgroundColor: "white",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    flex: 1
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: wp('3%'),
    minHeight: MODAL_HEIGHT,
    maxHeight: MODAL_HEIGHT,
  },
});