
class CommunicationController {
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + (queryParams ? "?" + queryParamsFormatted : "");
        //console.log("sending " + verb + " request to: " + url);

        const fetchData = {
            method: verb,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        if (verb !== "GET") {
            fetchData.body = JSON.stringify(bodyParams);
        }
        const httpResponse = await fetch(url, fetchData);

        const status = httpResponse.status;
        if (status == 200 || status === 201) {
            let deserializedObject = await httpResponse.json();
            return deserializedObject;
        } else if (status == 204) {
            console.log("Request successful, but no content was returned");
            return {};
        } else if (status == 409) {
            console.log("Errore: c'è un ordine già attivo")
            return null;
        } else {
            const message = await httpResponse.text();
            let error = new Error("Error message from the server. HTTP status: " + status + " " + message);
            throw error;
        }
    }

    //Registra un nuovo utente al sistema e restituisce il suo user ID (uid) e il suo session ID (sid).
    static async postUser() {
        const endpoint = "user";
        const verb = "POST";
        const queryParams = {};
        const bodyParams = {};
        console.log("postUser chiamata al server...");
        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta POST /user:", error);
            throw error;
        }
    }

    //Restituisce tutte le informazioni di un utente assieme al suo ultimo ordine effettuato.
    static async getUser(sid, uid) {
        let endpoint = "user/" + uid;
        let verb = "GET";
        let queryParams = { sid };
        let bodyParams = {};
        console.log("getUser called with endpoint: ", endpoint, " and queryParams: ", queryParams);
        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta GET /user:", error);
            throw error;
        }
    }

    //Aggiorna le informazioni di un utente.
    static async putUser(sid, uid, user) {
        let endpoint = "user/" + uid; 
        const verb = 'PUT';
        const queryParams = {};
        let bodyParams = {
            firstName: user.firstName,
            lastName: user.lastName,
            cardFullName: user.cardFullName,
            cardNumber: user.cardNumber,
            cardExpireMonth: user.cardExpireMonth,
            cardExpireYear: user.cardExpireYear,
            cardCVV: user.cardCVV,
            lastOid: user.lastOid,
            orderStatus: user.orderStatus,
            sid,
        };  
        //console.log("putUser called with endpoint: ", endpoint, " and bodyParams: ", bodyParams);
        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta PUT /user:", error);
            throw error;
        }
    }

    //Restituisce lo stato di un ordine.
    static async getOrder(oid, sid) {
        const endpoint = "order/" + oid;
        const verb = "GET";
        const queryParams = { sid };
        const bodyParams = {};
        console.log("getOrder chiamata al server...");
        console.log("oid in chiamata: ",oid);
        console.log("sid in chiamata: ",sid);
        try {
            console.log("getOrder chiamata al server...", endpoint, verb, queryParams, bodyParams);
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta GET /order:", error);
            throw error;
        }
    }

    //Acquista un menu e crea un nuovo ordine.
    static async postMenu(sid, mid, lat, lng) {
        const endpoint = "menu/" + mid + "/buy";
        const verb = "POST";     
        const queryParams = {};
        const bodyParams = {
            sid,
            deliveryLocation: {lat, lng},
        };
        console.log("postMenu chiamata al server...");
        
        try {
            const response = await this.genericRequest(endpoint, verb, queryParams, bodyParams);
            return response;
        } catch (error) {
            console.error("Errore durante la richiesta POST /menu:", error);
            throw error;
        }
    }

    //Restituisce i primi 20 menu più vicini alla posizione dell'utente.
    static async getMenu(sid, lat, lng) {
        const endpoint = "menu";
        const verb = "GET";
        const queryParams = { sid, lat, lng };
        const bodyParams = {};
        console.log('sid in chiamata: ',sid);
        console.log('lat in chiamata: ',lat);
        console.log('lng in chiamata: ',lng);
        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta GET /menu:", error);
            throw error;
        }
    }

    //Restituisce l'immagine del menu in base64.
    static async getImage(sid, mid) {
        const endpoint = "menu/" + mid + "/image";
        const verb = "GET";
        const queryParams = { sid };
        const bodyParams = {};
        //console.log("getImage chiamata al server...");
        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta GET /image:", error);
            throw error;
        }
    }

    //Restituisce i dettagli di un menu.
    static async getDetailsMenu(sid, mid, lat, lng ) {
        const endpoint = "menu/" + mid;
        const verb = "GET";
        const queryParams = { sid, lat, lng };
        const bodyParams = {};

        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta GET /menu:", error);
            throw error;
        }
    }

    //Elimina l'ordine in corso 
    static async deleteOrder(sid) {
        const endpoint = "order";
        const verb = 'DELETE';
        const queryParams = {sid}
        const bodyParams = {}

        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta DELETE /order:", error);
            throw error;
        }
    }
}
export default CommunicationController;