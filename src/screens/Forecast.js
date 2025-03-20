import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { BackgroundColor, LightColor, QuaternaryColor, QuinaryColor } from '../utilities/constant';
import { widthToDp as wp,heightToDp as hp } from '../utilities/responsive';

const Forecast = ({ route }) => {
    const { forecastData } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{new Date(forecastData.date).toLocaleDateString('en-US', { weekday: 'long' })}</Text>
            <Image source={{ uri: `https:${forecastData.day.condition.icon}` }} style={styles.weatherIcon} />
            
            <View style={styles.tempContainer}>
                <Text style={styles.temp}>{forecastData.day.maxtemp_c}°C</Text>
                <Text style={styles.tempMin}>{forecastData.day.mintemp_c}°C</Text>
            </View>

            <View style={styles.card}>
            <Text style={{color:QuaternaryColor,fontWeight:'bold',fontSize:hp(2.3),marginBottom:hp(2)}}>Weather Condition</Text>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>Humidity</Text>
                        <Text style={styles.infoValue}>{forecastData.day.avghumidity}%</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>Wind Speed</Text>
                        <Text style={styles.infoValue}>{forecastData.day.maxwind_kph} kph</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>Condition</Text>
                        <Text style={styles.infoValue}>{forecastData.day.condition.text}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>UV</Text>
                        <Text style={styles.infoValue}>{forecastData.day.uv}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
              <Text style={{color:QuaternaryColor,fontWeight:'bold',fontSize:hp(2.3),marginBottom:hp(2)}}>Additional Details</Text>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>Sunrise</Text>
                        <Text style={styles.infoValue}>{forecastData.astro.sunrise}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>Sunset</Text>
                        <Text style={styles.infoValue}>{forecastData.astro.sunset}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>Precipitation</Text>
                        <Text style={styles.infoValue}>{forecastData.day.totalprecip_in}%</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.infoLabel}>Wind Speed</Text>
                        <Text style={styles.infoValue}>{forecastData.day.maxwind_kph}kph</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9', padding: 15 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    weatherIcon: { width: 100, height: 100, alignSelf: 'center', marginBottom: 10 },
    tempContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    temp: { fontSize: 28, fontWeight: 'bold', marginRight: 10 },
    tempMin: { fontSize: 20, color: 'gray' },
    label: { fontSize: 16, fontWeight: 'bold' },
    card: { width: wp(92), backgroundColor: QuinaryColor, elevation: 3, borderRadius: wp(1.5), padding: hp(2), marginBottom: hp(2) },
    row: { flexDirection: 'row',justifyContent: 'space-between', marginBottom: hp(2)},
    column: { width: '45%', height: hp(8.5),justifyContent: 'center',alignItems: 'center',backgroundColor:`${LightColor}19`,borderRadius: wp(1.5),},
    infoLabel: { color: QuaternaryColor, fontSize: hp(2), textAlign: 'center', fontWeight: 'bold'},
    infoValue: { color: QuaternaryColor, fontSize: hp(2), textAlign: 'center', marginTop: hp(1)}
});

export default Forecast;
