import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { closestMenus, checkImageToDB } from './viewModel/AppViewModel';
import styles from './styles/styles';
import { AppContext } from './AppContext';
import MenuItem from './MenuItem';

export default function MenuList() {
  const [menuList, setMenuList] = useState([]);
  const [load, setLoad] = useState(true);
  const { sid, latitude, longitude } = useContext(AppContext);


  useEffect(() => {
    closestMenus(sid, latitude, longitude)
      .then((menus) => {
        setMenuList(menus);
        setLoad(false);
      })
      .catch((error) => {
        console.error("Errore durante il recupero dei menu:", error);
        setLoad(false);
      });
  }, []);

  return (
    <View style={styles.screenContainer}>
    {!load ? (
      <FlatList
        data={menuList}
        renderItem={({item}) => <MenuItem item={item}/>}
        keyExtractor={(item) => item.mid}
      />
    ) : (
        <ActivityIndicator size="large" color="#308446" />
    )}
    </View>
  );
}


/*
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AppContext } from "./AppContext";
import styles from "./styles/styles";
import { deleteOrder, deleteOrderInDelivery } from "./viewModel/AppViewModel";

export default function Esame(){
    const { latitude, longitude, oid, sid, uid, setScreen, setOid } = useContext(AppContext);

    const [load, setLoad] = useState(true);
    const [test, setTest] = useState("null");

    useEffect(() => {
        setTest("ciao");
        
    }, []);

    return(
        <View style={styles.screenContainer}>
            <Text>{test}</Text>
            <TouchableOpacity style={styles.button} onPress={() => deleteOrderInDelivery(sid)}>
                <Text style={styles.buttonText}>Elimina</Text>
              </TouchableOpacity>
        </View>
    );

}
*/