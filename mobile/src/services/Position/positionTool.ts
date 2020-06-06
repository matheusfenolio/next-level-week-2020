import { showLocation } from 'react-native-map-link'

export interface Coordinate{
    latitude: number,
    longitude: number
}

export enum Unit{
    Kilometers = 'KM', //Kilometers (default)
    Miles = 'M',  //Miles
    Nautical = 'N'   //Nautical
}


function calculateDistance(departure: Coordinate, arrival: Coordinate, unit?: Unit){

    if(!unit){
        unit = Unit.Kilometers;
    }

    if ((departure.latitude == arrival.latitude) && (departure.longitude == arrival.longitude)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * departure.latitude/180;
        var radlat2 = Math.PI * arrival.latitude/180;
        var theta = departure.longitude - arrival.longitude;
        var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == 'KM') { dist = dist * 1.609344 }
		if (unit == 'N') { dist = dist * 0.8684 }
		return  `${Math.round(dist)} ${unit}` ;
    }
}

export function openMap(departure: Coordinate, arrival: Coordinate){
    showLocation({
        latitude: arrival.latitude,
        longitude: arrival.longitude,
        sourceLatitude: departure.latitude,  
        sourceLongitude: departure.longitude,
    })
}


export default calculateDistance;