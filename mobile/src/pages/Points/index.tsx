import React, { useState, useEffect } from "react";
import api from '../../services/api';
import Constants from "expo-constants";
import * as Location from 'expo-location'
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import calculateDistance, { Coordinate, Unit } from '../../services/Position/positionTool';
import { SvgUri } from "react-native-svg";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from "react-native";


interface Params{
  UF: string,
  City: string
}

interface Item{
  id: number,
  name:	string,
  image_url: string,
}

interface Point{
		id: number,
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    latitude: number,
    longitude: number,
    city: string,
		uf: string
}

const Points = () => {

		const [items, setItems] = useState<Item[]>([]);
		const [points, setPoints] = useState<Point[]>([]);
		const [SelectedItems, setSelectedItems] = useState<number[]>([]);
		const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

    const navigation = useNavigation();
    
    const route = useRoute();
    const routeParams = route.params as Params;
    

		useEffect(() => {
			async function loadPosition(){
				const { status } = await Location.requestPermissionsAsync();
				if(status !== 'granted'){
					Alert.alert('Aviso', 'Precisamos de sua permissão para obter a sua localização');
					return;
				}else{
					const location = await Location.getCurrentPositionAsync();
					const { latitude, longitude } = location.coords;

					setInitialPosition([latitude, longitude]);
				}
			}

			loadPosition();
		}, []);

    useEffect(() => {
      api.get('items').then(response => {
        console.log(response.data);
        setItems(response.data);
      });
		}, []);
		
		useEffect(() => {
      
			api.get('points', {
				params:{
					uf: routeParams.UF,
					city: routeParams.City,
					items: SelectedItems
				}
			}).then(response => {
        setPoints(response.data);
			})
		}, [SelectedItems]);
    
    function handleNavigateBack(){
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number){
        navigation.navigate('Detail', {pointId: id});
		}
		
		function handleSelectedItem(id: number){
			const alreadySelected = SelectedItems.findIndex(item => item === id);

			if(alreadySelected >= 0){
				const filteredItems = SelectedItems.filter(item => item !== id);

				setSelectedItems(filteredItems);
			}else{
				setSelectedItems([...SelectedItems, id]);
      }
    }
    
    

    return (
        <>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34cb79" />
            </TouchableOpacity>
            
            <Text style={styles.title}>Bem vindo.</Text>
            <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

            <View style={styles.mapContainer}>
                {
									initialPosition[0] !== 0 && (
                    <MapView 
											style={styles.map}
											initialRegion={{
													latitude:  initialPosition[0],
													longitude: initialPosition[1],
													latitudeDelta: 0.014,
													longitudeDelta: 0.014
											}}
                		>

                    {
											points.map(point => {
                        console.log(point);
											  return (
													<Marker
															key={String(point.id)}
															onPress={() => handleNavigateToDetail(point.id)}
															style={styles.mapMarker} 
															coordinate={{
																	latitude: point.latitude,
																	longitude: point.longitude,
															}}
													>
															<View style={styles.mapMarkerContainer}>
																	<Image style={styles.mapMarkerImage} source={{ uri: point.image}}></Image>
                                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                  <Text 
                                    style={styles.mapMarkerTitle}>
                                    {
                                      calculateDistance(
                                        { latitude: initialPosition[0], longitude: initialPosition[1] },
                                        { latitude: point.latitude, longitude: point.longitude },
                                      )
                                    } 
                                  </Text>
															</View>
															
													</Marker>
												);
											})
										}

                </MapView>
									)
								}
            </View>

        </View>
        <View style={styles.itemsContainer}>
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20}}
            >

							{
								items.map(item => {return (
									<TouchableOpacity 
										key={String(item.id)} 
										style={[
											styles.item,
											SelectedItems.includes(item.id) ? styles.selectedItem : {}
										]} 
										activeOpacity={0.6}
										onPress={() => {handleSelectedItem(item.id)}}
									>
                    <SvgUri width={42} height={42} uri={item.image_url}/>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                	</TouchableOpacity>	
								)})
							}
            </ScrollView>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      minHeight: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      minHeight: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
      padding: 1,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;