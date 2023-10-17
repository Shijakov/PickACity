import { StyleSheet, View, Image, Text } from 'react-native';
import FloatingButton from '../components/FloatingButton';
import Map from '../components/Map';
import { useRef, useState } from 'react';
import { getAbstractForNameDbpedia, getLandmarksGeonames, getRandomCityGeonames } from '../functions/functions';
import LandmarkInfoModal from '../components/LandmarkInfoModal';
import FiltersModal from '../components/FiltersModal';
import { StatusBar } from 'expo-status-bar';
import { showMessage } from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';

const contPoints = {
  'AF': {latitude: 7.1881, longitude: 21.09375},
  'AS': {latitude: 29.84064, longitude: 89.29688},
  'EU': {latitude: 48.69096, longitude: 9.14062},
  'NA': {latitude: 46.07323, longitude: -100.54688},
  'SA': {latitude: -14.60485, longitude: -57.65625},
  'OC': {latitude: -18.31281, longitude: 138.51562},
  'AN': {latitude: -78.15856, longitude: 16.40626},
}

export default function HomePage() {

    const [landmarks, setLandmarks] = useState([]);
    const [buttonText, setButtonText] = useState('Throw pin');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModal, setSelectedModal] = useState({name: '', description: '', isVisible: false})
    const [onFilters, setOnFilters] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState(null);

    const mapRef = useRef();

    const onLandmarkPress = async (name) => {
      setSelectedModal({name, description: '', isVisible: true});
      const abstract = await getAbstractForNameDbpedia(name) ?? 'No result from wikipedia';
      setSelectedModal({name, description: abstract, isVisible: true});
    }

    const onSelectContinent = (continent) => {
      setSelectedContinent(continent);

      if (continent === null) {
        return;
      }

      const cont = contPoints[continent];

      mapRef.current.animateToRegion({
        ...cont,
        latitudeDelta: 120,
        longitudeDelta: 15,
      }, 1000);
    }

    const onButonClicked = async () => {
        setIsLoading(true);
        setButtonText('Pin is thrown');
        const randomCityResult = await getRandomCityGeonames(selectedContinent);

        if (!randomCityResult.success) {
          showMessage({
            message: randomCityResult.message,
            type: "danger",
          });
          setIsLoading(false);
          setButtonText('Throw pin');
          return;
        }

        const city = {
          lat: parseFloat(randomCityResult.payload.lat),
          lng: parseFloat(randomCityResult.payload.lng),
          name: randomCityResult.payload.name
        }

        setButtonText('Pin landed, searching for landmarks');

        mapRef.current.animateToRegion({
          latitude: city.lat,
          longitude: city.lng,
          latitudeDelta: 0.2022,
          longitudeDelta: 0.1621,
        }, 1000)

        const placesResult = await getLandmarksGeonames(city.name, selectedContinent);

        if (!placesResult.success) {
          showMessage({
            message: placesResult.message,
            type: "danger",
          });
          setIsLoading(false);
          setButtonText('Throw pin');
          return;
        }

        const places = placesResult.payload.map(place => ({
          isCity: false,
          lng: parseFloat(place.lng), 
          lat: parseFloat(place.lat),
          name: place.name,
          geonameId: place.geonameId,
        }));

        setButtonText('Throw pin');
        setIsLoading(false);
        setLandmarks([{
          isCity: true,
          name: city.name,
          lat: city.lat,
          lng: city.lng,
          geonameId: 0,
      },...places]);
    }

    return <View style={styles.container}>
      <View style={styles.menu} onTouchEnd={() => setOnFilters(true)}>
        <Image source={require('../assets/menu.png')} />
      </View>
      <FiltersModal 
      selectedContinent={selectedContinent} 
      setSelectedContinent={(val) => onSelectContinent(val)} 
      isVisible={onFilters} 
      closeModal={() => setOnFilters(false)} />
      <LandmarkInfoModal modal={selectedModal} closeModal={() => 
      setSelectedModal({name: '', description: '', isVisible: false})
      } />
    <FloatingButton disabled={isLoading} onButonClicked={onButonClicked} title={buttonText} position={{top: 100}} />
    <Map ref={mapRef} landmarks={landmarks} showLandmarkInfo={onLandmarkPress} />
    <StatusBar backgroundColor={onFilters ? 'white' : undefined} />
    <FlashMessage style={{alignItems: 'center', paddingTop: 30}} position="top" />
  </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menu: {
      position: 'absolute',
      top: 50,
      right: 30,
      zIndex: 100,
    }
  });