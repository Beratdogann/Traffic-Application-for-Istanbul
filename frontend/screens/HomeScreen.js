// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import DistrictPicker from '../components/DistrictPicker';

const socket = io('http://10.52.16.162:3000'); // kendi IP adresini yaz

export default function HomeScreen() {
    const navigation = useNavigation();
    const [fromDistrict, setFromDistrict] = useState(null);
    const [toDistrict, setToDistrict] = useState(null);
    const [liveTraffic, setLiveTraffic] = useState(null);

    useEffect(() => {
        socket.on('traffic_update', (rawData) => {
            try {
                setLiveTraffic(rawData);
            } catch (e) {
                console.error("Geçersiz veri:", rawData);
            }
        });

        return () => {
            socket.off('traffic_update');
        };
    }, []);

    const handleCheck = async () => {
        if (!fromDistrict || !toDistrict) {
            Alert.alert("Uyarı", "Lütfen her iki ilçeyi de seçin.");
            return;
        }

        try {
            const response = await fetch('http://10.52.16.162:3000/traffic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lat: "41.0082",
                    lon: "28.9784"
                }),
            });

            const data = await response.json();

            navigation.navigate('TrafficResultScreen', {
                from: fromDistrict,
                to: toDistrict,
                result: JSON.stringify(data),
            });

        } catch (error) {
            console.error("Hata:", error);
            Alert.alert("Hata", "Veri alınamadı");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>İstanbul Trafik Uygulaması</Text>

            <DistrictPicker label="Nereden" selected={fromDistrict} onSelect={setFromDistrict} />
            <DistrictPicker label="Nereye" selected={toDistrict} onSelect={setToDistrict} />

            <TouchableOpacity style={styles.button} onPress={handleCheck}>
                <Text style={styles.buttonText}>Kontrol Et</Text>
            </TouchableOpacity>

            {liveTraffic && (
                <View style={styles.liveContainer}>
                    <Text style={styles.liveTitle}>📡 Anlık Yayın:</Text>
                    <Text>Versiyon: {liveTraffic["@version"]}</Text>
                    <Text>Koordinat Sayısı: {liveTraffic.coordinates?.length || 0}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        backgroundColor: '#F0F8FF',
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#2E8B57',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    liveContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    liveTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    }
});
