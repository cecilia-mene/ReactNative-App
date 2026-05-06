import { View, Text, ActivityIndicator, AppState, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import MenuList from './MenuList';
import Profile from './Profile';
import Position from './Position';
import { getSidUid, locationPermissionAsync } from './viewModel/AppViewModel';
import { AppContext } from './AppContext';
import styles from './styles/styles';
import NavBar from './NavBar';
import MenuDetails from './MenuDetails';
//import Esame from './Esame';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Ingredients from './Ingredients';

export default function App() {

  const [screen, setScreen] = useState('menuList');
  const [sid, setSid] = useState(null);
  const [uid, setUid] = useState(null);
  const [load, setLoad] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [mid, setMid] = useState(null);
  const [oid, setOid] = useState(null);
  const [menuSelected, setMenuSelected] = useState({
    name: "",
    longDescription: "",
    price: 0,
    deliveryTime: "",
  });

  useEffect(() => {

    const loadLastPage = async () => {
      try {
        const lastPage = await AsyncStorage.getItem('lastPage');
        console.log('Ultima pagina recuperata da asyncStorage:', lastPage);
        return lastPage || 'menuList';
      } catch (error) {
        console.error('Errore durante il caricamento dell\'ultima pagina:', error);
      }
    };

    const inizializeApp = async () => {
      try {
        const location = await locationPermissionAsync();
        if (location == null) {
          Alert.alert("Hai negato l'accesso alla tua posizione", "consenti l'uso alla posizione per utilizzare l'app", [{ text: "riprova", onPress: () => requestLocationPermission() }])
        } else {
          setLatitude(location.latitude);
          setLongitude(location.longitude);
          try {
            const { sid, uid } = await getSidUid();
            setSid(sid);
            setUid(uid);

            const lastPage = await loadLastPage();
            console.log('Ultima pagina al lancio di UseEffect generico: ', lastPage);
            setScreen(lastPage);

            const savedMid = await AsyncStorage.getItem('currentMid');
            if(savedMid){
              setMid(parseInt(savedMid));
            }
          } catch (error) {
            console.error("Errore durante il recupero del sid e uid:", error);
          } finally {
            setLoad(false);
          }
        }
      } catch (error) {
        console.error("Errore durante il recupero della posizione:", error);
      }
    };
    inizializeApp();
  }, []);

  useEffect(() =>{
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        try {
          await AsyncStorage.setItem('lastPage', screen);
        } catch (error) {
          console.error('Failed to save the current screen:', error);
        }
      }
      console.log('Current screen:', screen);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [screen]);



  return (
    <AppContext.Provider value={{
      sid,
      uid,
      mid,
      load,
      setLoad,
      screen,
      latitude,
      longitude,
      setScreen,
      setMid,
      oid,
      setOid,
      menuSelected,
      setMenuSelected,
    }}>
      {!load ? (
        <View style={styles.container}>
          {/* Barra superiore */}
          <View style={styles.topBar}>
            <Text style={styles.title}>Mangia & Basta</Text>
          </View>
          {/* Contenuto */}
          {screen === 'menuList' && <MenuList />}
          {screen === 'profile' && <Profile />}
          {screen === 'position' && <Position />}
          {screen === 'details' && <MenuDetails />}
          {/*{screen === 'ingredients' && <Ingredients />}*/}
          <NavBar />
        </View>
      ) : (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#308446" />
        </View>
      )}
    </AppContext.Provider>
  );
}
