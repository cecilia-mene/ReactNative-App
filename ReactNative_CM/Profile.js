import React, { useState, useContext, useEffect } from 'react';
import { Text, TextInput, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { saveUser, showDetails, showOrderDetails, showUserInfo } from './viewModel/AppViewModel';
import styles from './styles/styles';
import { AppContext } from './AppContext';

export default function Profile() {
  const { sid, uid, oid, latitude, longitude, setOid } = useContext(AppContext);

  const [name, setName] = useState("null");
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    cardFullName: '',
    cardNumber: '',
    cardExpireMonth: 0,
    cardExpireYear: 0,
    cardCVV: '',
    uid: 0,
    lastOid: 0,
    orderStatus: '',
  });

  useEffect(() => {
    showUserInfo(sid, uid)
      .then((info) => {
        console.log('Dettagli dell\'utente:', info);
        setUser({
          firstName: info.firstName,
          lastName: info.lastName,
          cardFullName: info.cardFullName,
          cardNumber: info.cardNumber,
          cardExpireMonth: info.cardExpireMonth,
          cardExpireYear: info.cardExpireYear,
          cardCVV: info.cardCVV,
          uid: info.uid,
          lastOid: info.lastOid,
          orderStatus: info.orderStatus
        });
        setOid(info.lastOid)
        console.log('oid:', info.lastOid)

        if (info.lastOid){
          return showOrderDetails(info.lastOid, sid);
        } else{
          console.log('Nessun ordine effettuato');
          return null;
        }
      })
      .then((order) => {
        if (order){
          console.log('Dettagli dell\'ordine:', order);
          return showDetails(sid, order.mid, latitude, longitude);
        } else {
          console.log('Nessun ordine effettuato');
          return null;
        }
      })
      .then((details) => {
        if (details){
          setName(details.name);
          console.log('Nome del menu:', details.name);
        } 
      })
      .catch((error) => {
            console.error('Errore', error);
          });
      }, []);

  const handleInputChange = (field, text) => {
    console.log("field:", field, "text:", text);
    setUser({ ...user, [field]: text });
  }

  return (

    <View style={styles.screenContainer}>
      <ScrollView>
        <Text style={styles.menuName}>Completa il tuo profilo!</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={user.firstName}
          maxLength={15}
          onChangeText={(text) => handleInputChange('firstName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Cognome"
          value={user.lastName}
          maxLength={15}
          onChangeText={(text) => handleInputChange('lastName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome sulla carta"
          value={user.cardFullName}
          maxLength={31}
          onChangeText={(text) => handleInputChange('cardFullName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Numero carta"
          value={user.cardNumber}
          maxLength={16}
          onChangeText={(text) => handleInputChange('cardNumber', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mese scadenza"
          value={user.cardExpireMonth != null ? user.cardExpireMonth.toString(): ''}
          maxLength={2}
          onChangeText={(text) => handleInputChange('cardExpireMonth', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Anno scadenza"
          value={user.cardExpireYear!= null ? user.cardExpireYear.toString(): ''}
          maxLength={4}
          onChangeText={(text) => handleInputChange('cardExpireYear', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={user.cardCVV}
          maxLength={3}
          onChangeText={(text) => handleInputChange('cardCVV', text)}
        />

        <TouchableOpacity style={styles.button} onPress={() => saveUser(sid, uid, user)}>
          <Text style={styles.buttonText}>Salva</Text>
        </TouchableOpacity>

        {oid != null ? (
          <View>
            <Text style={styles.menuName}>Ultimo ordine effettuato: {name}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
