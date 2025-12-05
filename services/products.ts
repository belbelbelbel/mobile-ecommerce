import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { firestore } from '../config/firebase';

export interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  rating: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PRODUCTS_COLLECTION = 'products';

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(firestore, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Product));
  } catch (error: any) {
    console.error('Error fetching products:', error);
    // Preserve the underlying Firestore error message so the UI can show it
    throw new Error(error?.message || 'Failed to fetch products');
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestore, PRODUCTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
    );
    
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Product));
  } catch (error: any) {
    console.error('Error fetching products by category:', error);
    throw new Error(error?.message || 'Failed to fetch products by category');
  }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(firestore, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Product;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error fetching product:', error);
    throw new Error(error?.message || 'Failed to fetch product');
  }
};

// Search products by name
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation that fetches all products and filters client-side
    // For production, consider using Algolia or similar service for full-text search
    const allProducts = await getAllProducts();
    
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error: any) {
    console.error('Error searching products:', error);
    throw new Error(error?.message || 'Failed to search products');
  }
};

// Get featured/top-rated products
export const getFeaturedProducts = async (limitCount: number = 10): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestore, PRODUCTS_COLLECTION),
        where('rating', '>=', 4.5),
        orderBy('rating', 'desc'),
        limit(limitCount)
      )
    );
    
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Product));
  } catch (error: any) {
    console.error('Error fetching featured products:', error);
    throw new Error(error?.message || 'Failed to fetch featured products');
  }
};

// Add a new product (admin function)
export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(firestore, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: now,
      updatedAt: now,
    });
    
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding product:', error);
    // Bubble up the actual Firestore error message so the UI can display details
    throw new Error(error?.message || 'Failed to add product');
  }
};


export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(firestore, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error?.message || 'Failed to update product');
  }
};


export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(firestore, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(error?.message || 'Failed to delete product');
  }
};

// Initialize products with sample data
export const initializeSampleProducts = async (): Promise<void> => {
  try {
    const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Modern Light Clothes',
        category: 'T-Shirt',
        price: 50.99,
        rating: 5.0,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        description: 'A modern and comfortable light t-shirt perfect for everyday wear.',
        inStock: true,
      },
      {
        name: 'Elegant Summer Dress',
        category: 'Dress',
        price: 156.50,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
        description: 'Beautiful and elegant summer dress for special occasions.',
        inStock: true,
      },
      {
        name: 'Classic Denim Pants',
        category: 'Pants',
        price: 89.99,
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        description: 'Classic denim pants that never go out of style.',
        inStock: true,
      },
      {
        name: 'Cotton Polo Shirt',
        category: 'T-Shirt',
        price: 45.99,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
        description: 'Comfortable cotton polo shirt for casual and formal wear.',
        inStock: true,
      },
      {
        name: 'Floral Print Dress',
        category: 'Dress',
        price: 198.00,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
        description: 'Stylish floral print dress perfect for spring and summer.',
        inStock: true,
      },
      {
        name: 'Cargo Pants',
        category: 'Pants',
        price: 124.99,
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
        description: 'Versatile cargo pants with multiple pockets for functionality.',
        inStock: true,
      },
    ];

    // Check if products already exist
    const existingProducts = await getAllProducts();
    if (existingProducts.length === 0) {
      // Add sample products
      for (const product of sampleProducts) {
        await addProduct(product);
      }
      console.log('Sample products initialized successfully');
    }
  } catch (error: any) {
    console.error('Error initializing sample products:', error);
  }
};