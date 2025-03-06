import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React from 'react'
import { data } from '@/constant/Content'

export default function ImageContent() {
    return (
        <View>
            <FlatList
                data={data}
                horizontal
                style={{ width: '100%', marginHorizontal: 'auto', marginTop: 10 }}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginHorizontal: 'auto' }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.productItem}>
                        <View style={styles.overlay} />
                        <Image source={item.image} style={styles.productImage} />
                        <Text style={styles.productTitle}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    productItem: {
        marginRight: 15,
        alignItems: 'center',
        position: 'relative',
    },
    productImage: {
        width: 210,
        height: 120,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    overlay: {
        position: 'absolute',
        width: 210,
        height: 120,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    productTitle: {
        color: 'white',
        fontWeight: '800',
        width: '65%',
        marginTop: 5,
        position: 'absolute',
        left: 6,
        zIndex: 3,
        fontSize: 18,
        top: 15,
        backgroundColor: 'transparent',
    }
})
