import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { LeafletMouseEvent } from "leaflet";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";
import apiIBGE from "../../services/apiIBGE";

import Dropzone from "../../components/Dropzone";


import './styles.css'
import logo from '../../assets/logo.svg'

interface Item {
    id: number,
    name: string,
    image_url: string
}

interface UF{
    initial: string,
    name: string,
}

interface City{
    name: string
}

interface IBGEUFResponse {
    sigla: string,
    nome: string
}

interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {

    const [registerStatus, setRegisterStatus] = useState(false);

    const [items, setItems] = useState<Item[]>([]);
    const [UFs, setUFs] = useState<UF[]>([]);
    const [Cities, setCities] = useState<City[]>([]);

    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [selectedFile, setSelectedFile] = useState<File>();

    const [formData, setFormData] = useState({
       name: '',
       email: '',
       whatsapp: '' 
    });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setInitialPosition([
                position.coords.latitude,
                position.coords.longitude
            ]);
        });
    }, []);

    useEffect(() => {
        api.get('items')
        .then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        apiIBGE.get<IBGEUFResponse[]>('')
        .then(response => {
            const ufs = response.data.map(uf => {
                return {
                    initial: uf.sigla,
                    name: uf.nome,
                  } 
            })

            setUFs(ufs);
        });
    }, []);

    useEffect(() => {
        if(selectedUF !== '0'){
            apiIBGE
            .get<IBGECityResponse[]>(`${selectedUF}/municipios`)
            .then(
                response => {
                    const cities = response.data.map(city => {
                        return {
                            name: city.nome,
                          } 
                    })
        
                    setCities(cities);
                }
            );
        }else{
            setCities([]);
        }
    }, [selectedUF]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        setSelectedUF(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;

        setFormData({
            ...formData, 
            [name]: value
        })
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id]);
        }        
    }

    function handleBackToHome(){
        history.push('/');
    }

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp } = formData;

        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));   
        data.append('items', items.join(','));
        
        if(selectedFile){
            data.append('image', selectedFile);
        }

        api.post('points', data)
            .then(response => {
                if(response.status === 200){
                    setRegisterStatus(true);
                    setTimeout(handleBackToHome, 2000);
                }
            });
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit} >
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone 
                    onFileUploaded={setSelectedFile}
                />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                    </div>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email"
                                onChange={handleInputChange}
                                value={formData.email}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text" 
                                name="whatsapp" 
                                id="whatsapp"
                                onChange={handleInputChange}
                                value={formData.whatsapp}
                            />
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select 
                                onChange={handleSelectUf} 
                                value={selectedUF} 
                                name="uf" 
                                id="uf"
                            >
                                <option value="0">Selecione uma UF</option>

                                {
                                    UFs.map(uf => {
                                        return(
                                            <option key={uf.initial} value={uf.initial}>{uf.name}</option>
                                        );
                                    })
                                }

                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                onChange={handleSelectCity} 
                                value={selectedCity}
                                name="city" 
                                id="uf"
                            >

                                <option value="0">Selecione uma cidade</option>

                                {
                                Cities.map(city => {
                                        return(
                                            <option key={city.name} value={city.name}>{city.name}</option>
                                        );
                                    })
                                }

                            </select>
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {
                            items.map(item => {
                                return (
                                    <li className={selectedItems.includes(item.id) ? 'selected': ''} 
                                        key={item.id} 
                                        onClick={() => 
                                        handleSelectItem(item.id)}
                                    >
                                        <img src={item.image_url} alt={item.name}/>
                                        <span>{item.name}</span>
                                    </li>
                                );
                            })
                        }

                        
                    </ul>

                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>

            </form>
            {
                registerStatus? (<div id="finish-page-container">
                <div id="finish-page">
                </div>
                        
                        <div className="finish-page-message">
                            <FiCheckCircle />
                            <p>Cadastro concluído!</p>     
                        </div>
                                                
                </div>) : (<></>)
            }
        </div>
    );
}

export default CreatePoint;