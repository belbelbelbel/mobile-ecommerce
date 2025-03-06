import { View, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

type PropsTypes = {
    text: string,
    onChangeText: (text: string) => void,
    Placeholder: string,
    style?: any,
    show?: boolean,
}

export default function InputComponent({ text, onChangeText, Placeholder, style, show }: PropsTypes) {
    return (
        <View style={{ position: 'relative' }}>
            <TextInput
                style={[styles.input, style]}
                onChangeText={onChangeText}
                value={text}
                placeholder={Placeholder}
                placeholderTextColor="gray"
            />
            {
                show && (
                    <View style={{ position: 'absolute', right: 8, top: 12 }}>
                        <Ionicons name='search' color={'white'} size={25}></Ionicons>
                    </View>
                )
            }
        </View>
    )
}

// Default Input Styles
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        padding: 10,
        borderRadius: 5,
    }
})
