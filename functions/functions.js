import { getCity, getNumberCities, getLandmarks, getAbstract } from "../api/api";
import Geonames from "geonames.js";

const latLongFromPoint = point => {
    const [latitude, longitude] = point.split(' ');

    return [parseFloat(latitude), parseFloat(longitude)];
}

export const getRandomCity = async () => {
    const numCities = await getNumberCities();

    const offset = Math.random() * (numCities - 1);

    const city = await getCity(1, offset);

    const [latitude, longitude] = latLongFromPoint(city.point);

    return {
        city: city.city,
        latitude: latitude,
        longitude: longitude,
    };
}

export const getLandmarksForCity = async (city) => {
    const landmarks = await getLandmarks(city);

    return landmarks.map(landmark => {
        const [lat, long] = latLongFromPoint(landmark.point);
        return {
            place: landmark.place.split('resource/')[1],
            lat,
            long,
            description: landmark.abstract,
        }
    })
}

export const getAbstractForNameDbpedia = async (name) => {
    return await getAbstract(name);
}

const geonames = Geonames({
    username: 'shijako',
    lan: 'en',
    encoding: 'JSON'
  });

const doSearchGeonames = async (searchObject) => {
    try {
        const result = await geonames.search(searchObject);
        return {success: true, payload: result};
    } catch(err) {
        return {success: false, message: err.message};
    }
}

const getCountGeonames = async (searchObject) => {
    const result = await doSearchGeonames(searchObject);
    if (result.success) {
        return {success: true, payload: result.payload.totalResultsCount};
    } else {
        return result;
    }
}

export const getRandomCityGeonames = async (continent) => {
    const searchObject = {
        name: '*',
        maxRows: 1,
        featureClass: 'P',
        orderby: 'population',
    }

    if (continent) {
        searchObject.continentCode = continent;
    }

    const countResult = await getCountGeonames(searchObject);

    if (!countResult.success) {
        return countResult;
    }

    const startRow = Math.floor(Math.random() * Math.min(countResult.payload, 5000));

    const result =  await doSearchGeonames({
        ...searchObject,
        startRow
    });

    if (result.success) {
        return {success: result.success, payload: result.payload.geonames[0]};
    } else {
        return result;
    }
}

export const getLandmarksGeonames = async (city, continent) => {
    const searchObject = {
        name: city,
        maxRows: 20,
        featureClass: ['V', 'T', 'S', 'L', 'H'],
    }

    if (continent) {
        searchObject.continentCode = continent;
    }

    const result = await doSearchGeonames(searchObject);

    if (result.success) {
        return {success: result.success, payload: result.payload.geonames};
    } else {
        return result;
    }
}