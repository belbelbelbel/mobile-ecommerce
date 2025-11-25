import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonItem: React.FC<SkeletonProps> = ({ width, height, borderRadius = 8, style }) => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [animatedValue]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#e0e0e0',
          borderRadius,
          opacity: animatedValue,
        },
        style,
      ]}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <View
      style={{
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
      }}
    >
      {/* Image Skeleton with overlay elements */}
      <View style={{ position: 'relative', marginBottom: 12 }}>
        <SkeletonItem
          width="100%"
          height={140}
          borderRadius={12}
        />
        
        {/* Rating Skeleton - Top Left */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
          }}
        >
          <SkeletonItem width={40} height={20} borderRadius={12} />
        </View>

        {/* Favorite Button Skeleton - Top Right */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <SkeletonItem width={30} height={30} borderRadius={16} />
        </View>
      </View>
      
      {/* Title Skeleton - 2 lines */}
      <SkeletonItem
        width="100%"
        height={14}
        borderRadius={4}
        style={{ marginBottom: 4 }}
      />
      <SkeletonItem
        width="70%"
        height={14}
        borderRadius={4}
        style={{ marginBottom: 8 }}
      />
      
      {/* Category Skeleton */}
      <SkeletonItem
        width="50%"
        height={12}
        borderRadius={4}
        style={{ marginBottom: 8 }}
      />
      
      {/* Price Row */}
      <View style={{ marginBottom: 12 }}>
        <SkeletonItem width="35%" height={16} borderRadius={4} />
      </View>
      
      {/* Add to Cart Button Skeleton - Full Width */}
      <SkeletonItem
        width="100%"
        height={40}
        borderRadius={12}
      />
    </View>
  );
};

// Product Grid Skeleton
export const ProductGridSkeleton: React.FC = () => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </View>
  );
};

// Cart Item Skeleton
export const CartItemSkeleton: React.FC = () => {
  return (
    <View
      style={{
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 'auto',
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Image Skeleton */}
      <SkeletonItem
        width={80}
        height={80}
        borderRadius={8}
        style={{ marginRight: 16 }}
      />
      
      <View style={{ flex: 1 }}>
        {/* Title Skeleton */}
        <SkeletonItem
          width="80%"
          height={16}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />
        
        {/* Price Skeleton */}
        <SkeletonItem
          width="40%"
          height={14}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />
        
        {/* Quantity Controls Skeleton */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SkeletonItem width={30} height={30} borderRadius={4} style={{ marginRight: 8 }} />
          <SkeletonItem width={20} height={16} borderRadius={4} style={{ marginRight: 8 }} />
          <SkeletonItem width={30} height={30} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

// Header Skeleton
export const HeaderSkeleton: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#f8f9fa',
      }}
    >
      <View>
        <SkeletonItem width={120} height={16} borderRadius={4} style={{ marginBottom: 4 }} />
        <SkeletonItem width={80} height={20} borderRadius={4} />
      </View>
      
      <SkeletonItem width={50} height={50} borderRadius={25} />
    </View>
  );
};

export default SkeletonItem;