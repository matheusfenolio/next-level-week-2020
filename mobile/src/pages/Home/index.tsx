import React, { useEffect, useState } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { 
            View, 
            ImageBackground, 
            Image, 
            StyleSheet, 
            Text,
            Alert
        } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute } from "@react-navigation/native";
import apiIBGE from '../../services/apiIBGE';
const logo = require('../../assets/logo.png');
const homeBackgroung = require('../../assets/home-background.png');


interface UF{
  value: string,
  label: string,
}

interface City{
  value: string,
  label: string,
}

interface IBGEUFResponse {
  sigla: string,
  nome: string
}

interface IBGECityResponse {
  nome: string
}


const Home = () => {
    const navigation = useNavigation();

    const [UFs, setUFs] = useState<UF[]>([]);
    const [Cities, setCities] = useState<City[]>([]);

    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');


    useEffect(() => {
      apiIBGE.get<IBGEUFResponse[]>('')
        .then(response => {
            const ufs = response.data.map(uf => {
                return {
                    value: uf.sigla,
                    label: uf.nome,
                  } 
            })

            setUFs(ufs);
        });
    }, []);

    useEffect(() => {
      apiIBGE.get<IBGECityResponse[]>(`${selectedUF}/municipios`)
        .then(response => {
            const cities = response.data.map(city => {
                return {
                    value: city.nome,
                    label: city.nome,
                  } 
            })

            setCities(cities);
        });
    }, [selectedUF]);


    function handleNavigateToPoints(){
      if(selectedUF !== '0' && selectedCity !== '0'){
        navigation.navigate('Points', {UF: selectedUF, City: selectedCity})
      }else{
        Alert.alert('Aviso', 'Você precisa escolher um estado e uma cidade primeiro.')
      }
        
    }

    function handleSelectUf(value: string){
      setSelectedUF(value);
      setSelectedCity('0');
    }

    function handleSelectCity(value: string){
        setSelectedCity(value);
    }

    return (
        <ImageBackground 
            source={homeBackgroung} 
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={logo}></Image>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>
            
            <View style={styles.footer}>

              <RNPickerSelect
                style={{
                  inputAndroid: styles.input,
                  inputIOS: styles.input
                }}
                placeholder={{
                  label: 'Selecione um estado',
                  value: '0',
                }}
                onValueChange={handleSelectUf}
                items={UFs}
              />

              <RNPickerSelect 
                style={{
                  inputAndroid: styles.input,
                  inputIOS: styles.input
                }}
                placeholder={{
                  label: 'Selecione uma cidade',
                  value: '0',
                }}
                onValueChange={handleSelectCity}
                items={Cities}
              />

              <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                  <View style={styles.buttonIcon}>
                      <Text>
                          <Icon name="arrow-right" color="#FFF" size={24}/>
                      </Text>
                  </View>
                  <Text style={styles.buttonText}>Entrar</Text>
              </RectButton>
            </View>
            
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 24,
      fontFamily: 'Roboto_400Regular',
      color: '#6C6C80',
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;