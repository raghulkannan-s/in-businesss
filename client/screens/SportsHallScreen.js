import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../config';
import { useAuth } from '../contexts/AuthContext';

// This would be a real API call in your actual implementation
const mockProducts = [
  {
    id: '1',
    name: 'Professional Cricket Bat',
    category: 'Bats',
    price: 149.99,
    image: 'https://example.com/cricket-bat.jpg',
    inStock: true,
    discount: 10,
    rating: 4.8,
    description: 'Professional grade cricket bat made from premium English willow. Perfect for tournament play.',
    features: ['English Willow', 'Pro Handle Grip', 'Pre-knocked in']
  },
  {
    id: '2',
    name: 'Cricket Helmet',
    category: 'Protection',
    price: 89.99,
    image: 'https://example.com/cricket-helmet.jpg',
    inStock: true,
    discount: 0,
    rating: 4.7,
    description: 'Safety certified cricket helmet with adjustable fitting and superior protection.',
    features: ['Certified Protection', 'Adjustable Sizing', 'Moisture Wicking Liner']
  },
  {
    id: '3',
    name: 'Cricket Batting Gloves',
    category: 'Protection',
    price: 45.99,
    image: 'https://example.com/cricket-gloves.jpg',
    inStock: false,
    discount: 15,
    rating: 4.5,
    description: 'Professional batting gloves with extra padding for superior protection and comfort.',
    features: ['High Density Foam', 'Premium Leather', 'Ergonomic Design']
  },
  {
    id: '4',
    name: 'Cricket Ball Set',
    category: 'Balls',
    price: 29.99,
    image: 'https://example.com/cricket-ball.jpg',
    inStock: true,
    discount: 0,
    rating: 4.3,
    description: 'Set of 6 competition-grade cricket balls made with quality leather.',
    features: ['Genuine Leather', 'Hand Stitched', 'Competition Standard']
  },
  {
    id: '5',
    name: 'Cricket Shoes',
    category: 'Footwear',
    price: 119.99,
    image: 'https://example.com/cricket-shoes.jpg',
    inStock: true,
    discount: 20,
    rating: 4.6,
    description: 'Specialized cricket shoes with superior grip and ankle support.',
    features: ['Spike Configuration', 'Cushioned Midsole', 'Breathable Upper']
  },
  {
    id: '6',
    name: 'Batting Pads',
    category: 'Protection',
    price: 69.99,
    image: 'https://example.com/batting-pads.jpg',
    inStock: true,
    discount: 5,
    rating: 4.4,
    description: 'Lightweight yet durable batting pads with superior protection.',
    features: ['Lightweight Design', 'Contoured Fit', 'Quick Release System']
  }
];

const categories = [
  'All', 'Bats', 'Balls', 'Protection', 'Footwear', 'Clothing', 'Training Equipment'
];

const SportsHallScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterProducts(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, products]);

  const filterProducts = (category, search) => {
    let filtered = [...products];
    
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleAddToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      if (!product.inStock) {
        Alert.alert('Out of Stock', 'This product is currently unavailable');
        return;
      }
      
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === productId 
            ? {...item, quantity: item.quantity + 1} 
            : item
        ));
      } else {
        setCart([...cart, {...product, quantity: 1}]);
      }
      
      Alert.alert('Added to Cart', `${product.name} has been added to your cart`);
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderProductItem = ({ item }) => {
    const discountedPrice = item.discount 
      ? (item.price - (item.price * item.discount / 100)).toFixed(2) 
      : null;
      
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
      >
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            defaultSource={require('../assets/placeholder.png')}
          />
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
          {!item.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.categoryText}>{item.category}</Text>
          
          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            {discountedPrice ? (
              <>
                <Text style={styles.discountedPrice}>${discountedPrice}</Text>
                <Text style={styles.originalPrice}>${item.price}</Text>
              </>
            ) : (
              <Text style={styles.price}>${item.price}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.addToCartButton, 
              !item.inStock && styles.disabledButton
            ]}
            onPress={() => handleAddToCart(item.id)}
            disabled={!item.inStock}
          >
            <MaterialCommunityIcons 
              name="cart-plus" 
              size={16} 
              color={item.inStock ? COLORS.white : COLORS.gray} 
            />
            <Text style={[
              styles.addToCartText,
              !item.inStock && styles.disabledButtonText
            ]}>
              {item.inStock ? 'Add to Cart' : 'Unavailable'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sports Equipment Hall</Text>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item && styles.selectedCategoryText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
        />
      ) : (
        <View style={styles.noProductsContainer}>
          <MaterialCommunityIcons name="emoticon-sad-outline" size={80} color={COLORS.lightGray} />
          <Text style={styles.noProductsText}>No products found</Text>
          <Text style={styles.noProductsSubText}>Try changing your search or category</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart', { cart })}
        >
          <View style={styles.cartButtonContent}>
            <MaterialCommunityIcons name="cart" size={24} color={COLORS.white} />
            <Text style={styles.cartButtonText}>View Cart</Text>
          </View>
          <View style={styles.cartCount}>
            <Text style={styles.cartCountText}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.text,
  },
  categoriesContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedCategoryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  disabledButtonText: {
    color: COLORS.gray,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  noProductsSubText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  resetButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cartCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default SportsHallScreen;