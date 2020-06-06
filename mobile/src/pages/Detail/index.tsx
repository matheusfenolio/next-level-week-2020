import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';
import * as Location from 'expo-location';

import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking, Alert, ScrollView} from "react-native";
import calculateDistance, { openMap } from "../../services/Position/positionTool";
import { SvgUri } from "react-native-svg";

interface Params{
  pointId: number,
}

interface Data{
  point: {
    id: number,
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    latitude: number,
    longitude: number,
    city: string,
    uf: string
  },
  items: {
    title: string,
    image: string,
  }[]
}

const Detail = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const [point, setPoint] = useState<Data>({} as Data);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

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
      api.get(`points/${routeParams.pointId}`)
          .then(response => {
            setPoint(response.data);
          })
    }, []);

    function handleNavigateBack(){
        navigation.goBack();
    }

    function handleComposeMail(){
      MailComposer.composeAsync({
        subject: 'Interesse na coleta de resíduos!',
        recipients: [point.point.email],
      });
    }

    function handleWhatsapp(){
      Linking.openURL(`whatsapp://send?phone=${point.point.whatsapp}?text=Tenho interesse sobre a coleta de residuos!`)
    }

    function handleMapRoute(){
      openMap(
        { latitude: initialPosition[0], longitude: initialPosition[1] },
        { latitude: point.point.latitude, longitude: point.point.longitude }
      )
    }


    if(!point.point){
      return null;
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image 
                    style={styles.pointImage} 
                    source={{ uri: point.point.image}}
                />
                <Text style={styles.pointName}>{point.point.name}</Text>                 
                
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{point.point.city}, {point.point.uf}</Text>
                </View>
                
                <View style={styles.itemsContainer}>
                  <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  >   
                    {
                      point.items.map(item => {
                        return (
                          
                            <View key={String(item.title)} style={[styles.item, styles.selectedItem]} >
                              <SvgUri width={42} height={42} uri={item.image}/>
                            </View>
                          
                        )
                      })
                    }
                  </ScrollView>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" color="#FFF" size={20}/>   
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail" color="#FFF" size={20}/>   
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>

                <RectButton style={[styles.button, {width: '100%'}]} onPress={handleMapRoute}>
                    <Icon name="map" color="#FFF" size={20}/>   
                    <Text style={styles.buttonText}>Mapa ({
                      calculateDistance(
                        { latitude: initialPosition[0], longitude: initialPosition[1] },
                        { latitude: point.point.latitude, longitude: point.point.longitude },
                      )
                    })</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 24,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: "wrap"
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
    
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 32,
      marginBottom: 12,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 64,
      width: 64,
      borderRadius: 8,
      marginRight: 8,
      padding: 8,
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

export default Detail;