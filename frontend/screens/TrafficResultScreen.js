import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function TrafficResultScreen({ route }) {
    const from = route?.params?.from || 'Bilinmiyor';
    const to = route?.params?.to || 'Bilinmiyor';

    const rawResult = route?.params?.result;
    let result = {};
    try {
        result = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
    } catch (e) {
        console.log("JSON parse hatası:", e);
    }

    const data = result?.flowSegmentData || {};
    const frc = data?.frc || 'N/A';

    const currentSpeed = data?.currentSpeed;
    const freeFlowSpeed = data?.freeFlowSpeed;
    const currentTravelTime = data?.currentTravelTime;
    const freeFlowTravelTime = data?.freeFlowTravelTime;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Trafik Sonucu</Text>
            <Text style={styles.label}>Nereden: {from}</Text>
            <Text style={styles.label}>Nereye: {to}</Text>
            <Text style={styles.label}>FRC: {frc}</Text>

            <Text style={styles.label}>Anlık Hız: {currentSpeed ?? 'N/A'} km/s</Text>
            <Text style={styles.label}>Serbest Akış Hızı: {freeFlowSpeed ?? 'N/A'} km/s</Text>
            <Text style={styles.label}>
                Tahmini Süre: {currentTravelTime ? `${Math.round(currentTravelTime / 60)} dk` : 'N/A'}
            </Text>
            <Text style={styles.label}>
                Yoğunluk Var mı: {currentTravelTime && freeFlowTravelTime
                    ? (currentTravelTime > freeFlowTravelTime ? 'Evet' : 'Hayır')
                    : 'Bilinmiyor'}
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: '#F0F8FF',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
});
