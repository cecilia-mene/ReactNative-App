import CommunicationController from "../model/CommunicationController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import DBController from "../model/DBController";
import { Alert } from "react-native";


export async function getSidUid() {
    let storedSid = await AsyncStorage.getItem("sid");
    let storedUid = await AsyncStorage.getItem("uid");
    if (!storedSid || !storedUid) {
        try {
            const response = await CommunicationController.postUser();
            console.log("response:", response);
            await AsyncStorage.setItem("sid", response.sid);
            let parsedUid = JSON.stringify(response.uid);
            await AsyncStorage.setItem("uid", parsedUid);
            storedSid = response.sid;
            storedUid = response.uid;
            console.log("sid: ", storedSid);
            console.log("uid: ", storedUid);
            console.log("parsedUid: ", parsedUid);
        } catch (error) {
            console.error("Error during postUser:", error);
            return { sid: null, uid: null };
        }
    }
    return { sid: storedSid, uid: storedUid };
}

export async function locationPermissionAsync() {
    let canUseLocation = false;

    // Chiedi i permessi per la posizione
    const grantedPermission = await Location.getForegroundPermissionsAsync();
    if (grantedPermission.status === "granted") {
        canUseLocation = true;
    } else {
        const permissionResponse = await Location.requestForegroundPermissionsAsync();
        if (permissionResponse.status === "granted") {
            canUseLocation = true;
        }
    }
    // Ottieni la posizione solo se il permesso è stato concesso
    if (!canUseLocation) {
        return null
    } else {
        const location = await Location.getCurrentPositionAsync();
        return location.coords;  // Aggiorna lo stato con la posizione
    }
}

export async function closestMenus(sid, lat, lng) {
    try {
        const response = await CommunicationController.getMenu(sid, lat, lng);
        if (response) {
            return response;
        }
        else {
            return null;
        }
    } catch (error) {
        console.error("Errore durante il recupero dei menu:", error);
        return null;
    }
}

export async function loadImage(sid, mid, lat, lng) {
    const responseimg = await CommunicationController.getImage(sid, mid);
    const base64FromServer = responseimg.base64;
    const base64FromServerWithPrefix = "data:image/jpeg;base64," + base64FromServer;

    return base64FromServerWithPrefix;
    /*
try {
    const db = new DBController();
    await db.openDB();
 
    // Controllo se l'immagine è salvata in locale
    const localImage = await db.getImageFromDB(mid);
    if (localImage) {
        console.log(`Immagine trovata in locale per MID ${mid}`);
        console.log("Versione dell'immagine trovata in locale:", localImage.imageVersion);
        //console.log("Immagine trovata in locale:", localImage.base64.substring(0, 30));
        return localImage.base64;
    }
 
    const responseimg = await CommunicationController.getImage(sid, mid);
    const base64FromServer = responseimg.base64;
    const base64FromServerWithPrefix = "data:image/jpeg;base64," + base64FromServer;
 
    // Richiedi l'immagine al server se non è disponibile in locale
    console.log(`Immagine non trovata in locale, richiesta al server per MID ${mid}`);
    const response = await CommunicationController.getDetailsMenu(sid, mid, lat, lng);
    const imageVersion = response.imageVersion;
    console.log("Immagine ricevuta dal server:", base64FromServerWithPrefix.substring(0, 20));
    console.log("Versione dell'immagine ricevuta dal server:", imageVersion);
    await db.saveImage(mid, imageVersion, base64FromServerWithPrefix);
    return base64FromServerWithPrefix;
} catch (error) {
   console.error("Errore durante loadImage:", error);
    return null;
}*/
}


export async function showDetails(sid, mid, lat, lng) {
    try {
        const response = await CommunicationController.getDetailsMenu(sid, mid, lat, lng);
        if (response) {
            return response;
        } else {
            console.log("Errore durante il recupero dei dettagli del menu");
            return null;
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli del menu:", error);
    }
}

export async function saveUser(sid, uid, user) {
    const currentYear = new Date().getFullYear(); // Anno corrente
    let userIsValid = true;
    if (user.firstName === "") {
        console.log("Nome non inserito");
        Alert.alert("Nome non inserito", "Inserisci il tuo nome", [{ text: "Riprova" }]);
        userIsValid = false;
    } else if (/\d/.test(user.firstName)) {
        console.log("Non si possono mettere numeri nel nome");
        Alert.alert("Nome non valido", "Il nome non può contenere numeri", [{ text: "Riprova" }]);
        userIsValid = false;
    } else if (user.lastName === "") {
        console.log("Cognome non inserito");
        Alert.alert("Cognome non inserito", "Inserisci il tuo cognome", [{ text: "Riprova" }]);
        userIsValid = false;
    } else if (/\d/.test(user.lastName)) {
        console.log("Non si possono mettere numeri nel cognome");
        Alert.alert("Cognome non valido", "Il cognome non può contenere numeri", [{ text: "Riprova" }]);
        userIsValid = false;
    } else if (user.cardFullName === "") {
        console.log("Nome sulla carta non inserito");
        Alert.alert("Nome sulla carta non inserito", "Inserisci il nome sulla carta", [{ text: "Riprova" }]);
        userIsValid = false;
    } else if (/\d/.test(user.cardFullName)) {
        console.log("Non si possono mettere numeri nel nome sulla carta");
        Alert.alert("Nome sulla carta non valido", "Il nome sulla carta non può contenere numeri", [{ text: "Riprova" }]);
        userIsValid = false;
    } else if (!/^\d{16}$/.test(user.cardNumber)) {
        console.log("Il numero della carta deve contenere 16 cifre");
        Alert.alert("Numero della carta non valido", "Il numero della carta deve contenere 16 cifre", [{ text: "Riprova" }]);
        userIsValid = false;
    } else /*if (!/^1/.test(user.cardNumber)) {
        console.log("Il numero della carta non valido");
        Alert.alert("Errore nel numero della carta", "Numero della carta non valido", [{ text: "Riprova"}]);
        userIsValid = false;
    } else */if (user.cardExpireMonth === "") {
            console.log("Mese di scadenza non inserito");
            Alert.alert("Mese di scadenza non inserito", "Inserisci il mese di scadenza", [{ text: "Riprova" }]);
            userIsValid = false;
        } else if (parseInt(user.cardExpireMonth) < 1 || parseInt(user.cardExpireMonth) > 12) {
            console.log("Mese di scadenza non valido");
            Alert.alert("Mese di scadenza non valido", "Il mese di scadenza deve essere compreso tra 1 e 12", [{ text: "Riprova" }]);
            userIsValid = false;
        } else if (user.cardExpireYear === "") {
            console.log("Anno di scadenza non inserito");
            Alert.alert("Anno di scadenza non inserito", "Inserisci l'anno di scadenza", [{ text: "Riprova" }]);
            userIsValid = false;
        } else if (parseInt(user.cardExpireYear) < currentYear) {
            console.log("Anno di scadenza non valido");
            Alert.alert("Anno di scadenza non valido", "L'anno di scadenza non può essere inferiore all'anno corrente", [{ text: "Riprova" }]);
            userIsValid = false;
        } else if (!/^\d{3}$/.test(user.cardCVV)) {
            console.log("Il CVV non è valido");
            Alert.alert("CVV non valido", "Il CVV deve contenere 3 cifre", [{ text: "Riprova" }]);
            userIsValid = false;
        } else {
            console.log("Tutti i campi sono stati inseriti correttamente");
            Alert.alert("I tuoi dati sono stati salvati", "Dati salvati correttamente", [{ text: "Ok" }]);
            userIsValid = true;
        }

    if (userIsValid) {
        try {
            const response = await CommunicationController.putUser(sid, uid, user);
            if (response === undefined || response === null) {
                console.log('Utente salvato', response);
            }
            await AsyncStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
            console.error("Errore durante il caricamento e l'aggiornamento dell'utente:", error);
        }
    } else {
        console.log("Utente non valido");
    }
}

export async function createOrder(sid, mid, lat, lng) {
    console.log("chiamata la createOrder");
    try {
        const response = await CommunicationController.postMenu(sid, mid, lat, lng);
        return response;
    } catch (error) {
        console.error("Errore durante la creazione dell'ordine in createOrder:", error);
        throw error;
    }
}

export async function showOrderDetails(oid, sid) {
    try {
        const response = await CommunicationController.getOrder(oid, sid);
        if (response) {
            console.log("Dettagli dell'ordine:", response);
            return response;
        } else {
            console.log("Errore durante il recupero dei dettagli dell'ordine");
            return null;
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli dell'ordine:", error);
    }
}

export async function showUserInfo(sid, uid) {
    try {
        const response = await CommunicationController.getUser(sid, uid);
        if (response) {
            //console.log("Dettagli dell'utente:", response);
            return response;
        } else {
            console.log("Errore durante il recupero dei dettagli dell'utente");
            return null;
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli dell'utente:", error);
    }
}


export async function deleteOrderInDelivery(sid) {
    try {
        const response = await CommunicationController.deleteOrder(sid);
        if (response) {
            console.log("ordine eliminato")
            return response;
        } else {
            console.log("Errore durante l'eliminazione dell'ordine");
            return null;
        }
    } catch (error) {
        console.error("Errore durante l'eliminazione dell'ordine: ", error);
    }

}