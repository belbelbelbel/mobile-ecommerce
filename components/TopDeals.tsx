import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { products } from '@/constant/Content';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TopDeals() {
  const topRatedProducts = products.filter(product => product.rating > 4.8);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendation</Text>
      <FlatList
        data={topRatedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View className="flex items-center">
              <Image source={item.image} style={styles.productImage} />
              <Text style={styles.productDescription}>{item.name}</Text>
            </View>
            <View className="flex w-full flex-col gap-2">
              <View className='w-[75%] mx-auto'>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>
                  {item.price} <Text className="text-green-400">$</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/ProductsDetails/[id]", params: { id: item.id } })}
                className="items-center h-[2.2rem] rounded-[6px] flex justify-center bg-white mx-auto w-[78%]"
              >
                <Text className="text-black font-bold">Order</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'white', fontSize: 14, marginTop: 5, position: 'absolute', top: 7, left: 16, fontWeight: '700' }}>
              {item.rating} <Ionicons name='star'/>
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 20,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productItem: {
    width: '49.5%',
    height: 270,
    paddingTop: 20,
    borderRadius: 14,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    shadowColor: 'black',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 30,
  },
  productDescription: {
    color: 'white',
    fontWeight: '700',
    marginTop: 10,
  },
});
