import { View, Text, SafeAreaView, ImageBackground, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import LogoPart from '@/components/LogoPart'
import InputComponent from '@/components/InputComponent'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmail, signUpWithEmailAndPassword } from '@/services/auth';

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        displayName: ''
    });
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const routes = useRouter()

    const handleOnChangeForm = (name: string, value: string) => {
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSignIn = async() => {
        const { email, password } = form;
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        try {
            setLoading(true);
            await signInWithEmail(email, password);
            routes.replace('/(tabs)');
            setForm({ email: '', password: '', displayName: '' });
        } catch (error: any) {
            Alert.alert('Sign In Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async() => {
        const { email, password, displayName } = form;
        if (!email || !password || !displayName) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            await signUpWithEmailAndPassword(email, password, displayName);
            
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => routes.replace('/(tabs)') }
            ]);
            setForm({ email: '', password: '', displayName: '' });
        } catch (error: any) {
            Alert.alert('Sign Up Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForm = () => {
        if (isSignUp) {
            handleSignUp();
        } else {
            handleSignIn();
        }
    };
    
    return (
        <ImageBackground
            source={require("../assets/images/bg-img.jpg")}
            style={{ width: '100%', gap: 40, height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}
            resizeMode="cover"
        >
            <View className='absolute top-48'>
                <LogoPart />
            </View>

            <View className='h-[70%] rounded-t-[2.3rem] flex gap-7 bg-white w-full'>
                <View className='w-[85%] flex justify-center mt-10 gap-3 mx-auto'>
                    <Text className='text-3xl font-bold'>
                        {isSignUp ? 'Create your account' : 'Log in to your account'}
                    </Text>
                    <Text className='text-[0.8rem] font-light w-[90%]'>
                        {isSignUp
                            ? 'Please create an account to start shopping with us.'
                            : 'Please provide your email ID to log in before you place your order.'
                        }
                    </Text>
                </View>

                <View className='w-[85%] flex gap-6 mx-auto'>
                    <View className='w-full flex gap-3'>
                        {isSignUp && (
                            <InputComponent
                                text={form.displayName}
                                style={styles.input}
                                onChangeText={(value) => handleOnChangeForm('displayName', value)}
                                Placeholder={'Full Name'}
                            />
                        )}
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
                            className='bg-black w-[100%] h-[3.6rem] px-5 flex items-center justify-between flex-row rounded-[7px]'
                            onPress={handleSubmitForm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                                        {isSignUp ? 'SIGN UP' : 'SIGN IN'}
                                    </Text>
                                    <Ionicons name='arrow-forward' size={27} color="white" />
                                </>
                            )}
                        </TouchableOpacity>
                        {!isSignUp && (
                            <Text style={{ marginTop: 10, color: 'gray', fontSize: 16 }}>
                                Forgot Password?
                            </Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: '#E0E0E0' }}
                    className='w-[85%] relative top-[2rem] mx-auto h-[3.6rem] px-5 flex items-center justify-center flex-row rounded-[7px]'
                    onPress={() => setIsSignUp(!isSignUp)}
                    disabled={loading}
                >
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>
                        {isSignUp ? 'Already have an account? Sign In' : 'Create Account'}
                    </Text>
                </TouchableOpacity>
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
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.05,
        // shadowRadius: 6,
        elevation: 3,
        width: '100%',
        height: 48,
    }
});
