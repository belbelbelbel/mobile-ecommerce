import { View, Text, SafeAreaView, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import LogoPart from '@/components/LogoPart'
import InputComponent from '@/components/InputComponent'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const routes = useRouter()

    const handleOnChangeForm = (name: string, value: string) => {
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmiForm = async() => {
        const { email, password } = form;
        if (email && password) {
            routes.push('/products');
            setForm({ email: '', password: '' });
            await AsyncStorage.setItem('user', JSON.stringify({ email, password }));
        } else {
            alert('Please fill in all the fields');
        }
    }
    return (
        <ImageBackground
            source={require("../assets/images/bg-img.jpg")}
            style={{ width: '100%', gap: 40, height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}
            resizeMode="cover"
        >
            <View className='absolute top-48'>
                <LogoPart />
            </View>

            <View className='h-[65%]  rounded-t-[2.3rem] flex gap-7 bg-white w-full'>
                <View className='w-[85%] flex justify-center mt-10 gap-3 mx-auto'>
                    <Text className='text-3xl font-bold'>Log in to your account</Text>
                    <Text className='text-[1.05rem] font-light w-[90%]'>
                        Please provide your email ID to log in or sign up before you place your order.
                    </Text>
                </View>

                <View className='w-[85%] flex gap-8 mx-auto'>
                    <View className='w-full flex gap-3'>
                        <InputComponent
                            text={form.email}
                            style={styles.input}
                            onChangeText={(value) => handleOnChangeForm('email', value)}
                            Placeholder={'Email'}

                        />
                        <InputComponent
                            text={form.password}
                            style={styles.input}
                            onChangeText={(value) => handleOnChangeForm('password', value)}
                            Placeholder={'Password'}
                            show={true}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            className='bg-black  w-[100%] h-[4.2rem] px-5  flex items-center justify-between flex-row rounded-[7px]'
                            onPress={handleSubmiForm}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>SIGN IN</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 21 }}><Ionicons name='arrow-forward' size={27} /></Text>
                        </TouchableOpacity>
                        <Text style={{ marginTop: 10, color: 'gray', fontSize: 16 }}>Forgot Password?</Text>
                    </View>
                </View>
                {/* <View className=''> */}
                    <TouchableOpacity
                        style={{ backgroundColor: '#E0E0E0' }}
                        className='  w-[85%] relative  top-[5rem] mx-auto  h-[4.2rem] px-5  flex items-center justify-center flex-row rounded-[7px]'
                        onPress={() => alert('accoun createed')}
                    >
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, }}>Create Account</Text>
                        {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 21 }}><Ionicons name='arrow-forward' size={30} /></Text> */}
                    </TouchableOpacity>
                {/* </View> */}
            </View>
        </ImageBackground>
        // </SafeAreaView>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    input: {
        color: 'black',
        borderWidth: 0,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 7,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#E8E8E8',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        width: '100%',
        height: 58,
    }
});
