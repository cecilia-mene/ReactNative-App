import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import styles from './styles/styles';
import { AppContext } from './AppContext';
import { loadImage } from './viewModel/AppViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MenuItem({ item }) {

    const { sid, setScreen, setMid, latitude, longitude } = useContext(AppContext);
    const [image, setImage] = useState(null);

    useEffect(() => {
        let isActive = true;

        loadImage(sid, item.mid, latitude, longitude)
            .then((base64WithPrefix) => {
                if (isActive) 
                    setImage(base64WithPrefix);
            })
            .catch((error) => {
                if (isActive) console.error("Errore durante il recupero dell'immagine:", error);
            });
            return () => {
                isActive= false;
            };
    }, []);


    return (
        <TouchableOpacity style={styles.menuItem} 
        onPress={async () => { 
            setScreen('details'), 
            setMid(item.mid) 
            try {
                await AsyncStorage.setItem('currentMid', (item.mid).toString());
                console.log('mid salvato:',await AsyncStorage.getItem('currentMid'));
            } catch (error) {
                console.error('Errore durante il salvataggio del mid:', error);
            }
            }}>
            {image ? (
                <Image
                    source={{ uri: image }}
                    style={styles.menuImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#308446" />
                </View>
            )}
            <View style={styles.menuContent}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDescription}>{item.shortDescription}</Text>
                <View style={styles.menuFooter}>
                    <Text style={styles.menuPrice}>€{item.price}</Text>
                    <Text style={styles.menuTime}>{item.deliveryTime} min</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}