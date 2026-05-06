import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import styles from './styles/styles';
import { useEffect, useState, useContext } from 'react';
import { showDetails, loadImage, createOrder, showUserInfo } from './viewModel/AppViewModel';
import { AppContext } from './AppContext';


export default function MenuDetails() {
    const { sid, uid, latitude, longitude, mid, setScreen, setOid, menuSelected, setMenuSelected } = useContext(AppContext);
    const [imageSelected, setImageSelected] = useState(null);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        showDetails(sid, mid, latitude, longitude)
            .then((details) => {
                setMenuSelected({
                    name: details.name,
                    longDescription: details.longDescription,
                    price: details.price,
                    deliveryTime: details.deliveryTime
                });
                console.log("Dettagli del menu:", details);
                setLoad(false);
            })
            .catch((error) => {
                console.error("Errore durante il recupero dei dettagli del menu:", error);
                setLoad(false);
            });
        loadImage(sid, mid)
            .then((base64WithPrefix) => {
                setImageSelected(base64WithPrefix);
            })
            .catch((error) => {
                console.error("Errore durante il recupero dell'immagine:", error);
            });
    }, [mid]);

    return (
        <View style={styles.screenContainerDetails}>
            {!load ? (
                <View style={styles.detailsBox}>
                    <Image
                        source={{ uri: imageSelected }}
                        style={styles.menuImageDetails}
                        resizeMode="cover"
                    />
                    <Text style={styles.menuName}>{menuSelected.name}</Text>
                    <Text style={styles.menuDescription}>{menuSelected.longDescription}</Text>
                    <Text style={styles.menuPrice}>€{menuSelected.price}</Text>
                    <Text style={styles.menuTime}>{menuSelected.deliveryTime} min</Text>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        showUserInfo(sid, uid)
                            .then((info) => {
                                if (info.firstName === null && info.lastName === null && info.cardFullName === null && info.cardNumber === null && info.cardExpireMonth === null && info.cardExpireYear === null && info.cardCVV === null) {
                                    Alert.alert("Completa il tuo profilo", "Devi completare il tuo profilo per effettuare un ordine", [{ text: "Ok" }])
                                } else {
                                    console.log("carta registrata", info.cardNumber)
                                    if ((!/^1/.test(info.cardNumber))) {
                                        Alert.alert("Errore Carta di credito", "Per effettuare un ordine devi avere una carta di credito valida", [{ text: "Ok" }])
                                    } else {
                                        createOrder(sid, mid, latitude, longitude)
                                            .then((order) => {
                                                if (order === null) {
                                                    Alert.alert("Ordine in consegna", "Aspetta l'arrivo del tuo ordine prima di effettuarne un altro", [{ text: "Ok" }])
                                                } else {
                                                    console.log("Ordine creato con successo!")
                                                    setScreen("position")
                                                }
                                            })
                                            .catch((error) => {
                                                console.error("Errore durante la creazione dell'ordine:", error);
                                            });
                                    }
                                }
                            })
                            .catch((error) => {
                                console.error("Errore durante il recupero della carta dell'utente:", error);
                            });

                    }}>
                        <Text style={styles.buttonText}>Ordina</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={styles.button} onPress={() => {
                        setScreen("ingredients");
                    }}>
                        <Text style={styles.buttonText}>Visualizza ingredienti</Text>
                    </TouchableOpacity>*/}

                </View>
            ) : (
                <Text>Caricamento in corso...</Text>
            )
            }
        </View >
    );
}

/*
import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import styles from './styles/styles';
import { useEffect, useState, useContext } from 'react';

export default function Ingredients() {
    const { mid, setScreen, setOid, menuSelected, setMenuSelected } = useContext(AppContext);

    const [ingredients, setIngredients] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        showIngredients(mid)
            .then((ingredients) => {
                setIngredients(ingredients);
                console.log("Ingredienti del menu:", ingredients);
                setLoad(false);
            })
            .catch((error) => {
                console.error("Errore durante il recupero degli ingredienti del menu:", error);
                setLoad(false);
            });
    }, [mid]);

    return (
        <View style={styles.menuContent}>
            <Text style={styles.menuName}>{ingredients.name}</Text>
            <Text style={styles.menuDescription}>{ingredients.description}</Text>
            <View style={styles.menuFooter}>
                <Text style={styles.menuPrice}>€{ingredients.bio}</Text>
                <Text style={styles.menuTime}>{ingredients.origin}</Text>
            </View>
        </View>
    );
}
    */