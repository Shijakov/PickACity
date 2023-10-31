import { forwardRef } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Marker, PROVIDER_GOOGLE  } from 'react-native-maps';
import MapView from 'react-native-maps/lib/MapView';
import RedCircle from './RedCircle';

const Map = forwardRef(({landmarks, showLandmarkInfo}, ref) => {

    const markers = landmarks.map(landmark => 
    <Marker 
    key={landmark.geonameId}
    coordinate={{latitude: landmark.lat, longitude: landmark.lng}}
    onPress={() => showLandmarkInfo(landmark.name)} 
    >
      <View style={styles.centerText}>
        <Text>{landmark.name}</Text>
        {landmark.isCity ? <Image source={require('../assets/city.png')} /> : <RedCircle />}
      </View>
    </Marker>)

    return <View style={styles.fullScreen}>
      <MapView 
      provider={PROVIDER_GOOGLE}
      style={styles.fullScreen}
      initialRegion={{
        latitude: 48.69096, // This the position data
        longitude: 9.14062, // This is also position data
        latitudeDelta: 60,
        longitudeDelta: 15,
      }}
      ref={ref}
    > 
    {markers}
    </MapView>
    </View>
})

const styles = StyleSheet.create({
    fullScreen: {
        width: '100%',
        height: '100%'
      },
    centerText: {
      alignItems: 'center',
    }
  });

  export default Map;