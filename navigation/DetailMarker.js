import { StyleSheet, Text, View, Image, Dimensions, ScrollView, StatusBar, SafeAreaView, 
        TouchableOpacity, Modal, ActivityIndicator, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from './Loading';
import ResultZero from './ResultZero';
import Swiper from 'react-native-swiper';
import GestureRecognizer from 'react-native-swipe-gestures';
import { db } from './FireBaseConn';
import { ref, onValue, equalTo } from 'firebase/database'
import ResultNull from './ResultNull';
import ImageProgress from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const DetailMarker = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    let data = props.data;
    const show = props.show;
    const [events, setEvents] = useState(null);

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

    const goToPreviousImage = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const goToNextImage = () => {
        if (selectedImageIndex < events.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const onSwipeLeft = () => {
        goToNextImage();
    };

    const onSwipeRight = () => {
        goToPreviousImage();
    };

    const swipeConfig = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
    };

    async function getDettEvents(idRef) {
        try {
            const today = new Date();
            const currentDate = today.toISOString().slice(0, 10);
            let maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 7);
            maxDate = maxDate.toISOString().slice(0, 10);
            
            const starCountRef = ref(db, 'Eventi/');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                const newPosts = Object.keys (data).map(key => ({
                    id:key,
                    ...data[key]
                }));
                let listEvents = [];
                newPosts.map((item, index) => {
                    if (item.DATA >= currentDate && item.DATA <= maxDate && item.IDREF == idRef){
                        listEvents.push(item);
                    }
                });
                listEvents = listEvents.sort((a, b) => new Date(a.DATA) - new Date(b.DATA));
                setEvents(listEvents);
            });
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
        getDettEvents(data.ID);
    }, []);

    const handleOpenGoogleMaps = () => {
        const destination = data.INDIRIZZO; // Imposta la tua destinazione desiderata
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

        Linking.openURL(url);
    };

    function convertDateFormat(date) {
        // Dividi la data in anno, mese e giorno
        var parts = date.split('-');
        
        // Crea una nuova data nel formato desiderato
        var newDate = parts[2] + '/' + parts[1] + '/' + parts[0];
        
        return newDate;
    }

    return (
        <View style={{
            backgroundColor: "#fff",
            paddingTop: hp('1.5%'),
            paddingHorizontal: wp('3%'),
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            minHeight: !show ? height * 0.8 : height * 0.5,
            paddingBottom: hp('1%'),
            marginBottom: show ? hp('-80%') : 0,
        }}>
            <SafeAreaView>
                <View style={styles.center}>
                    <View style={[styles.barIcon, {marginTop: !show ? hp('-2%') : 0}]} />
                </View>
                <View style={{top: hp('1%'), display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize: hp('4%'), fontWeight: 'bold'}}>{data.NOME}</Text>
                    <ImageProgress 
                        key={data.ID} 
                        source={{ uri: data.HOME + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }} 
                        style={styles.img} 
                        resizeMode='contain'
                        indicator={ProgressBar}
                    ></ImageProgress>
                    <Text style={{
                        fontSize: hp('1.7%'),
                        marginTop: hp('2.5%')
                    }}><Icon name="map-marker" size={hp('2.5%')}/> {data.INDIRIZZO}</Text>
                    <TouchableOpacity style={{
                        backgroundColor: 'black',
                        paddingVertical: hp('0.8%'),
                        paddingHorizontal: wp('3%'),
                        borderRadius: 25,
                        top: show ? hp('3%') : hp('1.5%')}}
                    >
                        <Text onPress={handleOpenGoogleMaps} style={styles.buttonText}>APRI MAPPE</Text>
                    </TouchableOpacity>
                    {!show && (
                        <Text style={{fontSize: hp('3%'), fontWeight: 'bold', top: hp('3%')}}>Eventi Prossimi</Text>
                    )}
                </View>
                {!show && (
                    <View style={styles.containerImage}>
                        {!events && (<Loading visible={true}></Loading>) }
                        {events && events.length > 0 && (
                            <ScrollView 
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                            
                                {events ? events.map((image, id) => (
                                    <SafeAreaView key={id}>
                                        <View style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: hp('1.5%')
                                        }}>
                                            <Text>{convertDateFormat(image.DATA)}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => openModal(id)}>
                                        {loading && (
                                            <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="large" />
                                            </View>
                                        )}
                                            <Image source={{ uri: image.URL + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }} style={styles.scrollImage} resizeMode="stretch" onLoad={handleImageLoaded} />
                                        </TouchableOpacity>
                                        <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
                                        <View style={styles.modalContainer}>
                                            <GestureRecognizer
                                                onSwipeLeft={onSwipeLeft}
                                                onSwipeRight={onSwipeRight}
                                                config={swipeConfig}
                                                style={styles.modalContainer}
                                            >
                                                <Swiper
                                                    index={selectedImageIndex}
                                                    loop={false}
                                                    showsPagination={false}
                                                    onIndexChanged={(id) => setSelectedImageIndex(id)}
                                                >
                                                    {events.map((imageUrl, index) => ( 
                                                    <View key={index} style={styles.slide}>
                                                        <Image source={{ uri: imageUrl.URL + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }} style={styles.fullScreenImage} />
                                                    </View>
                                                    ))}
                                                </Swiper>
                                            </GestureRecognizer>
                                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                                <Text style={styles.closeButtonText}>Chiudi</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.previousButton} onPress={goToPreviousImage}>
                                                <Text style={styles.previousButtonText}>&lt;</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.nextButton} onPress={goToNextImage}>
                                                <Text style={styles.nextButtonText}>&gt;</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Modal>
                                    </SafeAreaView>
                                )) : ('')}
                            </ScrollView>
                        )}
                        {events && events.length === 0 && (<ResultNull></ResultNull>)}
                    </View>
                )}
            </SafeAreaView>
        </View>
    )
}

export default DetailMarker

const styles = StyleSheet.create({
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    barIcon: {
        width: wp('20%'),
        height: hp('0.8%'),
        backgroundColor: "#bbb",
        borderRadius: 3,
    },
    img: {
        display: "flex",
        justifyContent: "center",
        width: wp('50%'),
        height: hp('10%'),
        //resizeMode: 'stretch',
        //borderWidth: 1,
        //borderColor: '#000',
        top: hp('1%'),
        //borderRadius: 15
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opzionale: sovrapposizione sfondo semi-trasparente
    },
    buttonText: {
        color: 'white',
        fontSize: hp('1.7%'),
        fontWeight: 'bold',
    },
    containerImage: {
        top: hp('5%'),
        height: hp('42%'),
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollImage: {
        marginHorizontal: wp('5%'),
        width: wp('45%'),
        height: hp('38%'),
        borderRadius: 10
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'contain',
        //resizeMode: 'stretch',
    },
    closeButton: {
        position: 'absolute',
        //top: hp('1%'),
        right: wp('4%'),
        zIndex: 999,
        //backgroundColor: 'white',
        paddingVertical: hp('2%'),
        //borderRadius: 25,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: hp('2.5%'),
    },
    previousButton: {
        position: 'absolute',
        top: hp('50%'),
        left: wp('4%'),
        zIndex: 999,
    },
    previousButtonText: {
        color: '#FFFFFF',
        fontSize: hp('5.5%'),
    },
    nextButton: {
        position: 'absolute',
        top: hp('50%'),
        right: wp('4%'),
        zIndex: 999,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: hp('5.5%'),
    }
})