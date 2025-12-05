import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  Product 
} from '../services/products';
import { colors, layout, spacing, surfaces } from '@/styles/theme';
import { useToast } from '../contexts/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { pickAndUploadImage } from '../services/storage';

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    imageUrl: '',
    rating: '4.5',
    inStock: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signin');
      return;
    }
    loadProducts();
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (error: any) {
      console.error('Error loading products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      imageUrl: '',
      rating: '4.5',
      inStock: true,
    });
    setSelectedProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      rating: product.rating.toString(),
      inStock: product.inStock,
    });
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct?.id) return;
    
    try {
      setSaving(true);
      await deleteProduct(selectedProduct.id);
      showToast('Product deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      setUploadingImage(true);
      const imageUrl = await pickAndUploadImage();
      if (imageUrl) {
        setFormData({ ...formData, imageUrl });
        showToast('Image uploaded successfully', 'success');
      }
    } catch (error: any) {
      console.error('Error picking/uploading image:', error);
      showToast(error.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async () => {
    // Validation
    if (!formData.name.trim() || !formData.category.trim() || !formData.price.trim() || 
        !formData.description.trim() || !formData.imageUrl.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const price = parseFloat(formData.price);
    const rating = parseFloat(formData.rating);

    if (isNaN(price) || price <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      showToast('Rating must be between 0 and 5', 'error');
      return;
    }

    try {
      setSaving(true);
      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: price,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        rating: rating,
        inStock: formData.inStock,
      };

      if (selectedProduct?.id) {
        // Update existing product
        await updateProduct(selectedProduct.id, productData);
        showToast('Product updated successfully', 'success');
        setShowEditModal(false);
      } else {
        // Add new product
        await addProduct(productData);
        showToast('Product added successfully', 'success');
        setShowAddModal(false);
      }

      setSelectedProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        imageUrl: '',
        rating: '4.5',
        inStock: true,
      });
      loadProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      // Show the exact Firestore / validation error so you know what went wrong
      const message =
        typeof error?.message === 'string' && error.message.trim().length > 0
          ? error.message
          : 'Failed to save product';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View
      style={[
        surfaces.card,
        {
          marginHorizontal: spacing.screenPadding,
          marginBottom: 12,
          padding: 16,
          flexDirection: 'row',
        },
      ]}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          backgroundColor: '#f0f0f0',
        }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 4,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#666',
            marginBottom: 4,
          }}
        >
          {item.category}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#000',
            marginBottom: 4,
          }}
        >
          ${item.price.toFixed(2)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>
            {item.rating.toFixed(1)}
          </Text>
          <View
            style={{
              marginLeft: 12,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
              backgroundColor: item.inStock ? '#d4edda' : '#f8d7da',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: item.inStock ? '#155724' : '#721c24',
                fontWeight: '600',
              }}
            >
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => handleEditProduct(item)}
          style={{
            padding: 8,
            backgroundColor: '#e3f2fd',
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <Ionicons name="pencil" size={20} color="#1976d2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteProduct(item)}
          style={{
            padding: 8,
            backgroundColor: '#ffebee',
            borderRadius: 6,
          }}
        >
          <Ionicons name="trash" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFormModal = (isEdit: boolean) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddModal(false);
        setShowEditModal(false);
      }}
    >
      <SafeAreaView style={layout.screenContainer}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.screenPadding,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
          >
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {isEdit ? 'Edit Product' : 'Add Product'}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: spacing.screenPadding,
            paddingBottom: 100,
          }}
        >
          {/* Name */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#000' }}>
            Product Name *
          </Text>
          <TextInput
            style={[
              surfaces.card,
              {
                padding: 16,
                fontSize: 16,
                color: '#000',
                marginBottom: 16,
              },
            ]}
            placeholder="Enter product name"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          {/* Category */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#000' }}>
            Category *
          </Text>
          <TextInput
            style={[
              surfaces.card,
              {
                padding: 16,
                fontSize: 16,
                color: '#000',
                marginBottom: 16,
              },
            ]}
            placeholder="e.g., T-Shirt, Dress, Pants"
            placeholderTextColor="#999"
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
          />

          {/* Price */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#000' }}>
            Price ($) *
          </Text>
          <TextInput
            style={[
              surfaces.card,
              {
                padding: 16,
                fontSize: 16,
                color: '#000',
                marginBottom: 16,
              },
            ]}
            placeholder="0.00"
            placeholderTextColor="#999"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            keyboardType="decimal-pad"
          />

          {/* Rating */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#000' }}>
            Rating (0-5) *
          </Text>
          <TextInput
            style={[
              surfaces.card,
              {
                padding: 16,
                fontSize: 16,
                color: '#000',
                marginBottom: 16,
              },
            ]}
            placeholder="4.5"
            placeholderTextColor="#999"
            value={formData.rating}
            onChangeText={(text) => setFormData({ ...formData, rating: text })}
            keyboardType="decimal-pad"
          />

          {/* Image URL or Upload */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#000' }}>
            Product Image *
          </Text>
          
          {/* Image Preview */}
          {formData.imageUrl ? (
            <View
              style={[
                surfaces.card,
                {
                  marginBottom: 12,
                  padding: 12,
                  alignItems: 'center',
                },
              ]}
            >
              <Image
                source={{ uri: formData.imageUrl }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 12,
                  backgroundColor: '#f0f0f0',
                }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, imageUrl: '' })}
                style={{
                  marginTop: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '600' }}>
                  Remove Image
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* URL Input and Image Picker Row */}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              gap: 12,
            }}
          >
            <TextInput
              style={[
                surfaces.card,
                {
                  flex: 1,
                  padding: 16,
                  fontSize: 16,
                  color: '#000',
                },
              ]}
              placeholder="Enter image URL or pick from device"
              placeholderTextColor="#999"
              value={formData.imageUrl}
              onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
              autoCapitalize="none"
              editable={!uploadingImage}
            />
            <TouchableOpacity
              onPress={handleImagePicker}
              disabled={uploadingImage}
              style={{
                backgroundColor: uploadingImage ? '#ccc' : '#000',
                borderRadius: 12,
                paddingHorizontal: 20,
                paddingVertical: 16,
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 60,
              }}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="image-outline" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 16, marginTop: -8 }}>
            Paste an image URL or tap the icon to upload from your device
          </Text>

          {/* Description */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#000' }}>
            Description *
          </Text>
          <TextInput
            style={[
              surfaces.card,
              {
                padding: 16,
                fontSize: 16,
                color: '#000',
                marginBottom: 16,
                minHeight: 100,
                textAlignVertical: 'top',
              },
            ]}
            placeholder="Enter product description"
            placeholderTextColor="#999"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
          />

          {/* In Stock Toggle */}
          <View
            style={[
              surfaces.card,
              {
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              },
            ]}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              In Stock
            </Text>
            <Switch
              value={formData.inStock}
              onValueChange={(value) => setFormData({ ...formData, inStock: value })}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={formData.inStock ? '#1976d2' : '#f4f3f4'}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSaveProduct}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#ccc' : '#000',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                {isEdit ? 'Update Product' : 'Add Product'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={layout.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          Admin Panel
        </Text>
        <TouchableOpacity
          onPress={handleAddProduct}
          style={{
            padding: 8,
            backgroundColor: '#000',
            borderRadius: 8,
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={[
          surfaces.card,
          {
            marginHorizontal: spacing.screenPadding,
            marginTop: 16,
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
      >
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 12,
            fontSize: 16,
            color: '#000',
          }}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Products List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            Loading products...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.screenPadding }}>
          <Ionicons name="cube-outline" size={64} color="#ccc" />
          <Text style={{ marginTop: 16, fontSize: 18, color: '#666', textAlign: 'center' }}>
            {searchQuery ? 'No products found' : 'No products yet'}
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: '#999', textAlign: 'center' }}>
            {searchQuery ? 'Try a different search term' : 'Tap the + button to add your first product'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={loading}
          onRefresh={loadProducts}
        />
      )}

      {/* Add Product Modal */}
      {renderFormModal(false)}

      {/* Edit Product Modal */}
      {renderFormModal(true)}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={saving}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
}

