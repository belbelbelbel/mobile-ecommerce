import { View, Text, FlatList, Image, StyleSheet } from 'react-native'
import React from 'react'
import { categories } from '@/constant/Content'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function CategoriesContents() {
    const routes = useRouter()
    return (
        <View style={{ marginTop: 20 }}>
            <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{ color: 'black', fontSize: 20, fontWeight: '600', marginBottom: 15 }}>Categories</Text>
                <View style={{display:'flex',alignItems:'center',flexDirection:'row',gap:5}}>
                    <Text onPress={() => routes.navigate('/categoriespage')} style={{color:'black', fontWeight:'700'}}>More</Text>
                    <Text><Ionicons color={'black'} name="chevron-forward-outline"></Ionicons></Text>
                </View>
            </View>
            <FlatList
                style={{ width: '100%', marginHorizontal: 'auto', marginTop: 10,  }}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginHorizontal: 'auto' }}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                data={categories}
                renderItem={({ item }) => (
                    <View style={styles.categoryItem}>
                        <Image source={item.image} style={styles.categoryImage} />
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        display: 'flex',
        marginRight: 28,
      
    },
    categoryImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
        resizeMode: 'cover',
    },
    categoryText: {
        color: 'black',
        marginTop: 5,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700',
    }
})
