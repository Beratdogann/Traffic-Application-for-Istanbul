import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Districts } from '../constants/Districts';

export default function DistrictPicker({ label, selected, onSelect }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selected}
                    onValueChange={(itemValue) => onSelect(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Seçiniz" value={null} />
                    {Districts.map((district, index) => (
                        <Picker.Item key={index} label={district} value={district} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        marginBottom: 5
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5
    },
    picker: {
        height: 50,
        width: '100%',
    },
});
