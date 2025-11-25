import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../contexts/ToastContext';
import { layout, spacing, surfaces, colors } from '@/styles/theme';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const ShippingAddressScreen = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const savedAddresses = await AsyncStorage.getItem('shipping_addresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        // Sample addresses for demo
        const sampleAddresses: Address[] = [
          {
            id: '1',
            name: 'John Doe',
            phone: '+1 (555) 123-4567',
            street: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            isDefault: true,
          }
        ];
        setAddresses(sampleAddresses);
        await AsyncStorage.setItem('shipping_addresses', JSON.stringify(sampleAddresses));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddresses = async (updatedAddresses: Address[]) => {
    try {
      await AsyncStorage.setItem('shipping_addresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  };

  const handleSaveAddress = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      const newAddress: Address = {
        id: editingAddress ? editingAddress.id : Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };

      let updatedAddresses: Address[];
      if (editingAddress) {
        updatedAddresses = addresses.map(addr => 
          addr.id === editingAddress.id ? newAddress : addr
        );
      } else {
        updatedAddresses = [...addresses, newAddress];
      }

      await saveAddresses(updatedAddresses);
      showToast(editingAddress ? 'Address updated.' : 'Address added.', 'success');
      resetForm();
      setShowAddModal(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('Failed to save address. Please try again.', 'error');
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    const target = addresses.find((addr) => addr.id === addressId) || null;
    setDeleteTarget(target);
  };

  const handleSetDefault = async (addressId: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    await saveAddresses(updatedAddresses);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    });
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    });
    setShowAddModal(true);
  };

  const renderAddressItem = (address: Address) => (
    <View
      key={address.id}
      style={[
        surfaces.card,
        {
          padding: 16,
          marginHorizontal: spacing.screenPadding,
          marginBottom: spacing.sectionSpacing - 8,
          borderWidth: address.isDefault ? 2 : 1,
          borderColor: address.isDefault ? '#111' : colors.border,
        },
      ]}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#111',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600' }}>
            Default
          </Text>
        </View>
      )}

      {/* Address Info */}
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 8 }}>
        {address.name}
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
        {address.phone}
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 4, lineHeight: 18 }}>
        {address.street}
      </Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
        {address.city}, {address.state} {address.zipCode}
      </Text>

      {/* Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => openEditModal(address)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginRight: 8,
            }}
          >
            <Ionicons name="pencil" size={16} color="#666" />
            <Text style={{ fontSize: 14, color: '#666', marginLeft: 4, fontWeight: '600' }}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteAddress(address.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ffebee',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Ionicons name="trash" size={16} color="#f44336" />
            <Text style={{ fontSize: 14, color: '#f44336', marginLeft: 4, fontWeight: '600' }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>

        {!address.isDefault && (
          <TouchableOpacity
            onPress={() => handleSetDefault(address.id)}
            style={{
              backgroundColor: '#111',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>
              Set Default
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFormModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: '#f8f9fa',
            borderBottomWidth: 1,
            borderBottomColor: '#e9ecef',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowAddModal(false);
              setEditingAddress(null);
              resetForm();
            }}
          >
            <Text style={{ fontSize: 16, color: '#111' }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {editingAddress ? 'Edit Address' : 'Add Address'}
          </Text>
          <TouchableOpacity onPress={handleSaveAddress}>
            <Text style={{ fontSize: 16, color: '#111', fontWeight: '600' }}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Full Name *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Phone Number *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Street Address *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
                minHeight: 60,
              }}
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              placeholder="123 Main Street, Apt 4B"
              multiline
            />
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 2, marginRight: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>City *</Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#e9ecef',
                }}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                placeholder="City"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>State *</Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#e9ecef',
                }}
                value={formData.state}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
                placeholder="State"
              />
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>ZIP Code *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              value={formData.zipCode}
              onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
              placeholder="12345"
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Country</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              placeholder="United States"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={layout.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Shipping Address
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
          style={{
            backgroundColor: '#111',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
            Add New
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            Loading addresses...
          </Text>
        </View>
      ) : addresses.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
          }}
        >
          <Ionicons name="location-outline" size={80} color="#ccc" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#666',
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            No addresses yet
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#999',
              marginTop: 8,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            Add a shipping address to complete your orders
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#000',
              borderRadius: 20,
              paddingHorizontal: 24,
              paddingVertical: 12,
              marginTop: 20,
            }}
            onPress={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: spacing.sectionSpacing * 4,
          }}
          showsVerticalScrollIndicator={false}
        >
          {addresses.map(renderAddressItem)}
        </ScrollView>
      )}

      {renderFormModal()}
      <ConfirmationModal
        visible={Boolean(deleteTarget)}
        title="Delete Address"
        message={`Delete "${deleteTarget?.street || 'this address'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }
          try {
            setDeleteLoading(true);
            const updatedAddresses = addresses.filter((addr) => addr.id !== deleteTarget.id);
            if (updatedAddresses.length > 0 && !updatedAddresses.some((addr) => addr.isDefault)) {
              updatedAddresses[0].isDefault = true;
            }
            await saveAddresses(updatedAddresses);
            showToast('Address deleted.', 'success');
          } catch (error) {
            console.error('Error deleting address:', error);
            showToast('Failed to delete address.', 'error');
          } finally {
            setDeleteLoading(false);
            setDeleteTarget(null);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default ShippingAddressScreen;