import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, FlatList, PermissionsAndroid, Platform, Image, ScrollView } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from './weatherSlice';
import {widthToDp as wp,heightToDp as hp} from '../utilities/responsive';
import axios from 'axios';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LinearGradient from 'react-native-linear-gradient';
import { BackgroundColor, LightColor, PrimaryColor, QuaternaryColor, QuinaryColor, SecondaryColor } from '../utilities/constant';

const API_KEY = 'bd8b2a4edae84a6fb6090247251903';
const SEARCH_API = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;

const HomeScreen = ({ navigation }) => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [forecastCount, setForecastCount] = useState(3);
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.weather);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

    // Fetch user's location when the component mounts
    useEffect(() => {
        requestLocationPermission();
    }, []);

    // Request location permission
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation();
            }
        } else {
            getCurrentLocation();
        }
    };

    // Get the user's current location and fetch weather data
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => console.error('Error fetching location:', error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // Fetch weather by latitude and longitude
    const fetchWeatherByCoordinates = async (lat, lon) => {
        try {
            // setIsLoading(true); 
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`);
            setCity(response.data.location.name); // Set the current city
            dispatch(fetchWeather(response.data.location.name)); // Fetch weather data
        } catch (error) {
            console.error('Error fetching weather:', error);
        }finally{
            // setIsLoading(false);
        }
    };

    // Fetch city suggestions
    const fetchSuggestions = async (query) => {
        if (query.length > 2) {
            // setIsLoading(true);
            try {
                setIsFetchingSuggestions(true); 
                const response = await axios.get(`${SEARCH_API}${query}`);
                setSuggestions(response.data);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
            }finally {
                // setIsLoading(false);
                setIsFetchingSuggestions(false);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Handle city selection
    const handleSelectCity = (cityName) => {
        setCity(cityName);
        setSuggestions([]);
        dispatch(fetchWeather(cityName));
    };

    const handleAddForecast = () => {
        // Ensure we don't exceed available days
        if (forecastCount < data.forecast.forecastday.length) {
            setForecastCount(prevCount => prevCount + 1);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: BackgroundColor }}>
            {/* {
                isLoading || loading ? <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size={wp(8)} color={SecondaryColor}/>
                    <Text style={{color:SecondaryColor,fontSize:wp(4.5)}}>Loading Data...</Text>
                </View> : 
                <> */}
                    <ScrollView>
                        {/* Search Bar */}
                        <View style={{ width: '100%', height: 50, backgroundColor: QuinaryColor, alignItems: 'center', justifyContent: 'center',elevation:wp(0.1) }}>
                            <View style={{ width: '94%', height: 40, borderRadius: 10, backgroundColor: `${LightColor}33`, flexDirection: 'row' }}>
                                <EvilIcons name="search" size={24} color={QuaternaryColor} style={{ alignSelf: 'center', marginLeft: 5,marginBottom:hp(1) }} />
                                <TextInput
                                    placeholder="Search City name..."
                                    placeholderTextColor={QuaternaryColor}
                                    style={{ width: '100%', fontSize: 16, color: QuaternaryColor}}
                                    value={city}
                                    onChangeText={(text) => {
                                        setCity(text);
                                        fetchSuggestions(text);
                                    }}
                                />
                            </View>
                        </View>

                        {/* City Suggestions */}
                        {city.length > 0 && suggestions !== null && (
                            <View style={{position: 'absolute',top: 60,left: 10,right: 10,backgroundColor: 'white',borderRadius: 8,elevation: 5,zIndex: 10,maxHeight: 200,borderWidth: 1,borderColor: '#ccc'}}>
                                {suggestions.length > 0 ? (
                                    <FlatList
                                        data={suggestions}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity 
                                                onPress={() => {
                                                    handleSelectCity(item.name);
                                                    setCity(""); 
                                                    setSuggestions([]); 
                                                }}
                                            >
                                                <Text style={{ padding: 10, borderBottomWidth: 1 }}>
                                                    {item.name}, {item.country}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        style={{ maxHeight: 200 }}
                                    />
                                ) : (
                                    // Show "No results found" only when user types something but no results appear
                                    city.length > 2 && suggestions.length === 0 && !isFetchingSuggestions && city !== data?.location?.name && (
                                        <View style={{ padding: 10, alignItems: 'center' }}>
                                            <Text style={{ color: 'gray', fontSize: 16 }}>🚫 No results found</Text>
                                        </View>
                                    )
                                )}
                            </View>
                        )}


                        {loading && <ActivityIndicator size="large" />}
                        {error && <Text>Error: {error}</Text>}

                        {/* Weather Data */}
                        {data && (
                            <View style={{ width: '94%', height: 180, borderRadius: 10, marginHorizontal: 10, marginTop: 10, elevation: 3, overflow: 'hidden' }}>
                                <LinearGradient
                                    colors={['#003366', '#336699']}
                                    style={{ width: '100%', height: '60%', padding: 10, flexDirection: 'row' }}
                                >
                                    <View style={{ width: '50%', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>
                                            {data?.location?.name || 'New York City'}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: 'white', opacity: 0.8 }}>
                                            {data?.location?.localtime || 'Monday, Feb 12'}
                                        </Text>
                                    </View>

                                    <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>
                                            {data?.current?.temp_c}°C
                                        </Text>
                                        <Text style={{ fontSize: 14, color: 'white', opacity: 0.8 }}>
                                            {data?.current?.condition?.text || 'Partly Cloudy'}
                                        </Text>
                                    </View>
                                </LinearGradient>

                                <View style={{ width: '100%', height: '40%', backgroundColor: 'white', padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, color: 'gray' }}>Feels like</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                                                {data?.current?.feelslike_c}°C
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, color: 'gray' }}>Wind</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                                                {data?.current?.wind_kph} km/h
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, color: 'gray' }}>Humidity</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                                                {data?.current?.humidity}%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Today's Timeline */}
                        {data?.forecast?.forecastday[0]?.hour && (
                            <View style={{ width: '94%', borderRadius: 10, marginHorizontal: 10, marginTop: 10, backgroundColor: 'white', padding: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Today's Timeline</Text>
                                
                                <FlatList
                                    data={data.forecast.forecastday[0].hour.slice(10, 17)} // Get a subset of hours (customize as needed)
                                    horizontal
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View style={{ alignItems: 'center', marginRight: 15 }}>
                                            <Text style={{ fontSize: 12, color: 'gray' }}>
                                                {(() => {
                                                    let hours = new Date(item.time).getHours();
                                                    let period = hours >= 12 ? 'PM' : 'AM';
                                                    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
                                                    return `${hours} ${period}`;
                                                })()}
                                            </Text>

                                            <Image 
                                                source={{ uri: `https:${item?.condition?.icon}` }} 
                                                style={{ width: 30, height: 30 }}
                                            />
                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.temp_c}°C</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        )}

                        {/* 3-Day Forecast */}
                        {data?.forecast?.forecastday && (
                            <View style={{ width: '94%', borderRadius: 10, marginHorizontal: 10, marginTop: 10, backgroundColor: PrimaryColor, padding: 10,marginBottom:hp(2) }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>3-Day Forecast</Text>

                                <FlatList
                                    data={data.forecast.forecastday.slice(1, forecastCount + 1)} // Get the next 3 days
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => navigation.navigate('Forecast',{ forecastData: item })} style={{ width:'100%',height:hp(11),marginTop:hp(2),flexDirection: 'row', justifyContent: 'space-between',backgroundColor:BackgroundColor,paddingVertical:hp(3),paddingHorizontal:wp(2),borderRadius:wp(2),elevation:wp(0.1) }}>
                                            <View>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' })}</Text>
                                                <Text style={{ fontSize: 12, color: 'gray' }}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                                            </View>

                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Image 
                                                    source={{ uri: `https:${item?.day?.condition?.icon}` }} 
                                                    style={{ width: 30, height: 30 }}
                                                />
                                                <View>
                                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.day.maxtemp_c}°C</Text>
                                                    <Text style={{ fontSize: 12, color: 'gray' }}>{item.day.mintemp_c}°C</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                                {forecastCount < data.forecast.forecastday.length && (
                                    <TouchableOpacity onPress={handleAddForecast} style={{width:wp(20),height:hp(5),backgroundColor:'#003366',justifyContent:'center',alignItems:'center',borderRadius:wp(2),alignSelf:'center',marginTop:hp(2)}}>
                                        <Text style={{color:PrimaryColor,fontSize:hp(2),fontWeight:'bold'}}>Add</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </ScrollView>
                {/* </>
            } */}
        </View>
    );
};

export default HomeScreen;
