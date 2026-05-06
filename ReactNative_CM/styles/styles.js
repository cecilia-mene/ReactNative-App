//stile menu list

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    width: '95%',
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#DAFDDA', // Verde chiaro per il background dei menu
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  screenContainerDetails: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsBox: {
    width: '90%', // Larghezza del box relativa allo schermo
    backgroundColor: '#DAFDDA', 
    borderRadius: 10, 
    padding: 20,
    alignItems: 'center',
    alaignSelf: 'center',
},
menuImageDetails: {
    width: '100%', // L'immagine occupa tutta la larghezza del box
    height: 200, // Altezza fissa
    borderRadius: 10, // Angoli arrotondati per l'immagine
    marginBottom: 20, // Spazio tra immagine e contenuto
},
  menuContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#308446', // Verde scuro per i titoli
  },
  menuDescription: {
    fontSize: 14,
    color: '#555', // Testo descrittivo più neutro
    marginTop: 4,
    marginBottom: 8,
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#308446',
  },
  menuTime: {
    fontSize: 14,
    color: '#308446',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50, // Puoi regolarlo in base all'altezza desiderata
},

  //style app
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#308446",
    flex: 0.15,
  },
  title: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
  },
  screenContainer: {
    flex: 0.8,
    justifyContent: "center",
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#308446",
    flex: 0.10,
  },
  navButton: {
    alignItems: "center",

  },
  navText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  mapContainer: {
    flex: 1,
  },
  containerProfile: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleProfile: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#308446', // Verde scuro per i titoli
  },
  input: {
    width: '100%', // Larghezza adattabile
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25, // Bordo tondeggiante
    paddingHorizontal: 15, // Spaziatura interna
    marginVertical: 10, // Spaziatura tra i campi
    borderWidth: 1,
    borderColor: '#CCC',
    fontSize: 16,
    textAlign: 'center', // Testo centrato
  },
  button: {
    width: 150, // Pulsante più piccolo
    height: 50,
    backgroundColor: '#308446', // Colore del pulsante
    borderRadius: 25, // Bordo tondeggiante
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  statusContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  

});
