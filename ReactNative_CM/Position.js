import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { AppContext } from './AppContext';
import MapView, { Marker } from 'react-native-maps';
import styles from './styles/styles';
import { showDetails, showOrderDetails, showUserInfo } from './viewModel/AppViewModel';


export default function Position() {

  const { latitude, longitude, oid, sid, uid, setScreen, setOid } = useContext(AppContext);
  const [load, setLoad] = useState(true);
  //info menu
  const [name, setName] = useState("null");
  const [location, setLocation] = useState({ lat: 0, lng: 0 }); //posizione del menu

  //info order
  const [order, setOrder] = useState({
    status: "",
    mid: null,
    deliveryLocation: { lat: null, lng: null },
    deliveryTimestamp: "",
    expectedDeliveryTimestamp: "",
    currentPosition: { lat: null, lng: null },
  });

  const formatStatus = (status) => status === "ON_DELIVERY" ? "In consegna" : status === 'COMPLETED' ? 'Consegnato' : 'Stato non disponibile';
  const formatTimestamp = (timestamp) => {
    if (timestamp === "null") return " non disponibile";
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0'); // Giorno con 2 cifre
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mese con 2 cifre
    const year = date.getFullYear(); // Anno
    const hours = date.getHours().toString().padStart(2, '0'); // Ore in formato 24h
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minuti con 2 cifre
    return `${day}/${month}/${year}, ${hours}:${minutes}  `;
  }

  useEffect(() => {
    showUserInfo(sid, uid)
      .then((info) => {
        if (info.lastOid === null) {
          console.log('Oid null:', oid);
          Alert.alert("Ordine mancante", "Non hai ancora effettuato un ordine. Per accedere alla posizione, devi prima completare un ordine.",
            [{ text: "OK", onPress: () => setScreen("menuList") }]
          );
        } else {
          console.log('Oid:', info.lastOid);
          setOid(info.lastOid)
        }
      })

    const fetchOrderDetails = async () => {
      showOrderDetails(oid, sid)
        .then((order) => {
          setOrder({
            status: order.status,
            mid: order.mid,
            deliveryLocation: { lat: order.deliveryLocation.lat, lng: order.deliveryLocation.lng },
            deliveryTimestamp: order.deliveryTimestamp,
            expectedDeliveryTimestamp: order.expectedDeliveryTimestamp,
            currentPosition: { lat: order.currentPosition.lat, lng: order.currentPosition.lng },
          });

          showDetails(sid, order.mid, latitude, longitude)
            .then((details) => {
              setName(details.name);
              setLocation({ lat: details.location.lat, lng: details.location.lng });
            })
            .catch((error) => {
              console.error('Errore durante il recupero dei dettagli del menu:', error);
            });
          setLoad(false);
        })
        .catch((error) => {
          console.error('Errore durante il recupero dei dettagli dell\'ordine:', error);
        });
    };

    if (oid != null) {
      fetchOrderDetails();
    }


    const interval = order.status !== "COMPLETED" ? setInterval(fetchOrderDetails, 5000) : null;
    return () => {
      clearInterval(interval);
    };
  }, [oid, sid, order.status]);


  return (
    <View style={styles.screenContainer}>
      {!load ? (
        <>
          <Text style={styles.statusText}>{name != null ? name : "caricamento..."}</Text>
          <Text style={styles.statusText}>Stato: {formatStatus(order.status)}</Text>
          {order.status === 'COMPLETED' ? (
            <>
              <Text style={styles.statusText}>Consegnato: {formatTimestamp(order.deliveryTimestamp)}</Text>
              <MapView
                style={styles.mapContainer}
                region={{
                  latitude: order.deliveryLocation.lat || 0,
                  longitude: order.deliveryLocation.lng || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: order.deliveryLocation.lat,
                    longitude: order.deliveryLocation.lng,
                  }}
                  title="Ordine consegnato"
                  pinColor="green"
                />
              </MapView>
            </>
          ) : (
            <>
              <Text style={styles.statusText}>Consegna prevista: {formatTimestamp(order.expectedDeliveryTimestamp)}</Text>                     

              <MapView
                style={styles.mapContainer}
                region={{
                  latitude: order.deliveryLocation.lat,
                  longitude: order.deliveryLocation.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                  title="Posizione ristorante"
                  pinColor="blue"
                />
                <Marker
                  coordinate={{
                    latitude: order.currentPosition.lat,
                    longitude: order.currentPosition.lng,
                  }}
                  title="Posizione drone"
                  pinColor="red"
                />
                <Marker
                  coordinate={{
                    latitude: order.deliveryLocation.lat,
                    longitude: order.deliveryLocation.lng,
                  }}
                  title="Posizione di consegna"
                  pinColor="green"
                />
              </MapView>
            </>
          )}
        </>
      ) : (
        <ActivityIndicator size="large" color="#308446" />
      )}
    </View>
  );
}