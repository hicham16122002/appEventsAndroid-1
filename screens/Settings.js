import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Button,
  ToastAndroid,
  ActivityIndicator
} from 'react-native'
import { LocalDataSet } from '../navigation/LocalDataSet'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { db } from '../navigation/FireBaseConn';
import { ref as databaseRef, onValue, remove } from 'firebase/database'
import DateInputSettings from '../navigation/DateInputSettings'
import ImageUploader from '../navigation/Uploader'
import { getStorage, ref as firebase, deleteObject } from 'firebase/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getListPoster } from '../results/LastItemPoster';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [locals, setLocals] = useState(null);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [listLocals, setListLocals] = useState(null);
  const [posters, setPosters] = useState(null);
  const [existingEvent, setExistingEvent] = useState([]);
  let data = [];
  const todayDate = new Date();
  let currentDay= String(todayDate.getDate()).padStart(2, '0');
  let currentMonth = String(todayDate.getMonth()+1).padStart(2,"0");
  let currentYear = todayDate.getFullYear();
  let currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
  const [date, setDate] = useState(currentDate);
  const [operation, setOperation] = useState('Add');
  const [removing, setRemoving] = useState(false);
  const [lastItem, setLastItem] = useState(0);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  async function getLocals(checkEventList = []) {
    try {
      const starCountRef = databaseRef(db, 'Locali/');

      onValue(starCountRef, (snapshot) => {
        data = snapshot.val();
        setListLocals(data);

        const selectedColumns = [];
        data = data.filter(local => local.TIPO === 'LOCALE')
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const item = data[key];
            const selectedColumn = {
              id: item.ID,
              title: item.NOME,
            };
            selectedColumns.push(selectedColumn);
          }
        }
        if (operation === 'Add'){
          setLocals(selectedColumns.filter(obj => !checkEventList.includes(obj.id)));
        } else if (operation === 'Delete'){
          setLocals(selectedColumns.filter(obj => checkEventList.includes(obj.id)));
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getPosters(selectedDate) {
    try {  
      const paramData = selectedDate;
      const starCountRef = databaseRef(db, 'Eventi/');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        let newPosts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPosters(newPosts);
        if (operation === 'Delete'){
          let listEvents = [];
          newPosts.map((item, index) => {
            if (item.DATA == paramData && item.IDREF == selectedLocal.ID) {
              listEvents.push(item);
            }
          });
          setPosters(listEvents);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getLocals(existingEvent);
    getPosters(date);
    getListPoster()
    .then((maxID) => {
      setLastItem(maxID);
    })
    .catch((error) => {
      console.error('Errore:', error);
    });
  }, [selectedLocal, operation]);

  const handleItemSelected = (item) => {
    let localSet = [];
    if (item){
      for (key in listLocals){
        let value = listLocals[key];
        if (value.ID && item.id && value.ID == item.id){
          if (operation === 'Add'){
            localSet = {
              HOME: value.HOME,
              ICONA: value.ICONA,
              IDREF: value.ID,
              INDIRIZZO: value.INDIRIZZO,
              NOME: value.NOME,
              ID: lastItem + 1
            };
          } else if (operation === 'Delete'){
            localSet = value;
            getPosters(date);
          }
        }
      }
    }
    setSelectedLocal(localSet);
  };

  const handleDateChange = (paramDate, event) => {
    setDate(paramDate);
    // if (operation === 'Add'){
      setExistingEvent(event);
      getLocals(event);
    if (operation === 'Delete'){
      getPosters(event);
    }
  };

  const changeOperation = () => {
    if (operation === 'Add'){
      setOperation('Delete');
    } else if (operation === 'Delete') {
      setOperation('Add');
    }
  };

  const deleteImage = async () => {
    setRemoving(true);
    const idRow = posters[0].ID - 1;
    const eventiRef = databaseRef(db, 'Eventi/' + idRow);
  
    // Rimuovi l'immagine da Firebase Storage
    const storage = getStorage();
    const imageRef = firebase(storage, posters[0].URL);
    
    deleteObject(imageRef)
      .then(() => {
        // Rimuovi la riga dell'evento dal database
        remove(eventiRef)
          .then(() => {
            setRemoving(false);
            ToastAndroid.show('Dati eliminati correttamente dal database', ToastAndroid.SHORT);
          })
          .catch((error) => {
            setRemoving(false);
            ToastAndroid.show('Errore durante l\'eliminazione dei dati nel database: ' + error, ToastAndroid.SHORT);
          });
      })
      .catch((error) => {
        setRemoving(false);
        ToastAndroid.show('Errore durante l\'eliminazione dell\'immagine dallo storage: ' + error, ToastAndroid.SHORT);
      });
  };

  return (
    <AutocompleteDropdownContextProvider>
      <SafeAreaView style={({ flex: 1 })}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled>
          <ScrollView
            nestedScrollEnabled
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 0 }}
            style={styles.scrollContainer}>
            <View style={styles.container}>
              <View style={styles.titleContainer}>
              <TouchableOpacity onPress={changeOperation}>
                <Image
                  source={require('../assets/alter.png')}
                  style={{ height: hp('3%'), width: wp('6%'), marginRight: wp('1%') }}
                />
              </TouchableOpacity>
                <Text style={styles.title}>
                  {operation === 'Add' ? 'Creazione Eventi' : 'Eliminazione Eventi'}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lista locali</Text>
                <LocalDataSet data={locals} operation={operation} onItemSelected={handleItemSelected}/>
                <Text style={[styles.sectionTitle, {marginTop: hp('2%')}]}>Data evento</Text>
                <DateInputSettings onDateChange={handleDateChange}></DateInputSettings>
                {operation === 'Add' && (
                  <SafeAreaView>
                    <Text style={[styles.sectionTitle, {marginTop: hp('2%')}]}>Caricamento</Text>
                    <ImageUploader data={selectedLocal} date={date} posters={posters}/>
                  </SafeAreaView>
                )}
                {operation === 'Delete' && (
                  <SafeAreaView>
                    {posters && posters.length > 0 && (
                      <SafeAreaView>
                      <View style={styles.deleteButton}>
                        <Button title='ELIMINA IMMAGINE' onPress={deleteImage}/>
                      </View>
                        {posters.map((poster, index) => (
                          <Image 
                            key={index}
                            source={{uri: poster.URL + '&token=d586c965-bfbd-4a8b-ac0c-1b17eb3db6ad' }} 
                            style={{width: wp('92%'), height: hp('57%'), opacity: removing ? 0.5 : 1}}
                            resizeMode={'contain'}
                          >
                          </Image>
                        ))}
                        {removing && <ActivityIndicator style={styles.loadingIndicator} size="large" color="black" />}
                      </SafeAreaView>
                    )}
                  </SafeAreaView>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AutocompleteDropdownContextProvider>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1
  },
  container: {
    padding: wp('4%')
  },
  title: {
    textAlign: 'center',
    fontSize: hp('3.5%'),
    //marginBottom: hp('4%')
  },
  section: {
    marginBottom: hp('2%')
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: hp('0.5%')
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: hp('2%')
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('4%')
  },
  deleteButton: {
    marginTop: hp('1%'),
    marginBottom: hp('1.5%')
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }],
  }
})

export default App
