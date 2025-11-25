import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { StyleSheet } from'react-native'

export default function LogoPart() {
    return (
            <View
            >
                <View style={{ display: 'flex', flexDirection: 'column', gap: 55, alignItems: 'center', width: '96%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                        <Image source={require('../assets/images/logo.png')} style={{ height: 45, width: 45 }} />
                        <Text style={{ color: "white", fontSize: 60, fontFamily: "ClashDisplay-Bold", letterSpacing: 2 }}>
                            ShopNest
                        </Text>
                    </View>

                </View>

            </View>
    )
}

