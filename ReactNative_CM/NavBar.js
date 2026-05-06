import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from './AppContext';
import styles from './styles/styles';

export default function NavBar() {
    const {setScreen} = useContext(AppContext);

    return(
        <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => setScreen("menuList")}>
          <Icon name="restaurant-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setScreen("position")}>
          <Icon name="location-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => setScreen("profile")}>
          <Icon name="person-outline" size={30} color="#fff" />
        </TouchableOpacity>
        {/*<TouchableOpacity style={styles.navButton} onPress={() => setScreen("esame")}>
          <Icon name="book" size={30} color="#fff" />
        </TouchableOpacity>*/}
      </View>
    )
}