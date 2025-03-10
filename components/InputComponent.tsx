import { View, TextInput, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

type PropsTypes = {
    text: string,
    onChangeText: (text: string) => void,
    Placeholder: string,
    style?: any,
    show?: boolean,
}

export default function InputComponent({ text, onChangeText, Placeholder, style, show, }: PropsTypes) {
    const [pressed, setPressed] = useState(false)
    return (
        <View style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'row' }}>
            <TextInput
                style={[styles.input, style]}
                onChangeText={onChangeText}
                value={text}
                placeholder={Placeholder}
                placeholderTextColor="gray"
            />
            {
                show && (
                    <Pressable style={{ position: 'absolute', right: 12 }} onPress={() => setPressed(!pressed)}>
                        {
                            pressed ? <Ionicons name='eye' color={'black'} size={25} ></Ionicons> : <Ionicons name='eye-off' color={'black'} size={25} ></Ionicons>
                        }
                    </Pressable>
                )
            }
        </View>
    )
}

// Default Input Styles
const styles = StyleSheet.create({
    input: {
        borderWidth: 0,
        borderColor: 'black',
        color: 'white',
        padding: 10,
        borderRadius: 5,
    }
})
