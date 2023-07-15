import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { firebase } from './FireBaseStorage';
import { db } from './FireBaseConn';
import { ref as databaseRef, push, set } from 'firebase/database';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function App(props) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  let insertRow = props.data;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);
      setUploaded(false);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      ToastAndroid.show('Seleziona un\'immagine da caricare', ToastAndroid.SHORT);
      return;
    }

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });

    const fileName = image.substring(image.lastIndexOf("/") + 1);
    const ref = firebase.storage().ref().child(`events/${fileName}`);
    const snapshot = ref.put(blob);

    snapshot.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        setUploading(true);
      },
      (error) => {
        setUploading(false);
        console.log(error);
        blob.close();
        ToastAndroid.show('Caricamento fallito', ToastAndroid.SHORT);
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false);
          setImage(url);
          setUploaded(true);
          blob.close();
          insertRow.DATA = props.date;
          insertRow.URL = 'https://firebasestorage.googleapis.com/v0/b/appevents-c9f8d.appspot.com/o/events%2F' + fileName + '?alt=media';
          ToastAndroid.show('Caricamento completato', ToastAndroid.SHORT);
          const eventiRef = databaseRef(db, 'Eventi/' + (insertRow.ID - 1));

          set(eventiRef, {
            DATA: insertRow.DATA,
            HOME: insertRow.HOME,
            ICONA: insertRow.ICONA,
            ID: insertRow.ID,
            IDREF: insertRow.IDREF,
            INDIRIZZO: insertRow.INDIRIZZO,
            NOME: insertRow.NOME,
            URL: insertRow.URL,
          })
            .then(() => {
              ToastAndroid.show('Dati inseriti correttamente nel database', ToastAndroid.SHORT);
            })
            .catch((error) => {
              ToastAndroid.show('Errore durante l\'inserimento dei dati nel database: ' + error, ToastAndroid.SHORT);
            });
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectButton}>
        <Button title='SELEZIONA IMMAGINE' onPress={pickImage} />
      </View>
      {!uploading && image && !uploaded && (Object.keys(insertRow).length != 0) && (
        <View style={styles.uploadButton}>
          <Button title='CARICA IMMAGINE' onPress={uploadImage} />
        </View>
      )}
      {image && !uploaded && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={[styles.image, { opacity: uploading ? 0.5 : 1 }]} />
          {uploading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="black" />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    width: wp('89.5%'),
    height: hp('46%'),
    marginTop: hp('2%'),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  selectButton: {},
  uploadButton: {
    marginTop: hp('2%')
  },
});
