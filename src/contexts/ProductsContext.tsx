import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: 'fertilizer' | 'pesticide' | 'seed' | 'tool' | 'equipment';
  price: number;
  unit: string;
  description: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
}

interface ProductsContextType {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/');
      if (response.ok) {
        const data = await response.json();
        // Map backend data to frontend format
        const formattedProducts = data.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          category: p.category,
          price: p.price,
          unit: p.unit,
          description: p.description,
          image: p.image || '📦',
          stock: p.stock,
          rating: p.rating,
          reviews: p.reviews,
          seller: p.seller,
          location: p.location
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Keep existing mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const [mockProducts] = useState<Product[]>([
    // Fertilizers
    {
      id: '1',
      name: 'Organic Compost Fertilizer',
      category: 'fertilizer',
      price: 450,
      unit: '50kg bag',
      description: 'Premium organic compost enriched with essential nutrients. Perfect for all crops and improves soil health naturally.',
      image: '🌱',
      stock: 150,
      rating: 4.5,
      reviews: 89,
      seller: 'GreenGrow Supplies',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      name: 'NPK Complex Fertilizer 19:19:19',
      category: 'fertilizer',
      price: 850,
      unit: '50kg bag',
      description: 'Balanced NPK fertilizer suitable for all crops. Provides nitrogen, phosphorus, and potassium in equal proportions.',
      image: '🌱',
      stock: 200,
      rating: 4.7,
      reviews: 156,
      seller: 'AgriChem Industries',
      location: 'Pune, Maharashtra'
    },
    {
      id: '3',
      name: 'Urea Fertilizer',
      category: 'fertilizer',
      price: 600,
      unit: '50kg bag',
      description: 'High-quality urea fertilizer with 46% nitrogen content. Ideal for rapid plant growth and green foliage.',
      image: '🌱',
      stock: 300,
      rating: 4.3,
      reviews: 124,
      seller: 'FarmFresh Supplies',
      location: 'Delhi, NCR'
    },
    {
      id: '4',
      name: 'Vermicompost Premium',
      category: 'fertilizer',
      price: 350,
      unit: '40kg bag',
      description: 'Natural vermicompost produced from earthworms. Rich in nutrients and beneficial microorganisms.',
      image: '🌱',
      stock: 180,
      rating: 4.8,
      reviews: 203,
      seller: 'EcoFarm Solutions',
      location: 'Bangalore, Karnataka'
    },

    // Pesticides
    {
      id: '5',
      name: 'Organic Neem Oil Pesticide',
      category: 'pesticide',
      price: 280,
      unit: '1 liter',
      description: 'Natural neem oil-based pesticide. Safe for organic farming, controls pests and diseases effectively.',
      image: '🛡️',
      stock: 120,
      rating: 4.6,
      reviews: 98,
      seller: 'NatureCare Agro',
      location: 'Chennai, Tamil Nadu'
    },
    {
      id: '6',
      name: 'Insecticide - Chlorpyrifos 20% EC',
      category: 'pesticide',
      price: 520,
      unit: '1 liter',
      description: 'Broad-spectrum insecticide for control of soil and foliage pests in various crops.',
      image: '🛡️',
      stock: 95,
      rating: 4.4,
      reviews: 67,
      seller: 'CropProtect Ltd',
      location: 'Hyderabad, Telangana'
    },
    {
      id: '7',
      name: 'Fungicide - Mancozeb 75% WP',
      category: 'pesticide',
      price: 380,
      unit: '500g pack',
      description: 'Protective fungicide for control of early and late blight in vegetables and fruits.',
      image: '🛡️',
      stock: 140,
      rating: 4.5,
      reviews: 89,
      seller: 'AgriShield Products',
      location: 'Ahmedabad, Gujarat'
    },
    {
      id: '8',
      name: 'Bio Pesticide - Bacillus Thuringiensis',
      category: 'pesticide',
      price: 320,
      unit: '250ml',
      description: 'Organic bio-pesticide for caterpillar and larvae control. Safe for beneficial insects.',
      image: '🛡️',
      stock: 75,
      rating: 4.7,
      reviews: 112,
      seller: 'BioAgri Solutions',
      location: 'Kolkata, West Bengal'
    },

    // Seeds
    {
      id: '9',
      name: 'Hybrid Rice Seeds - HR-1001',
      category: 'seed',
      price: 1200,
      unit: '10kg pack',
      description: 'High-yielding hybrid rice seeds with disease resistance. Suitable for all seasons.',
      image: '🌾',
      stock: 500,
      rating: 4.8,
      reviews: 234,
      seller: 'SeedTech India',
      location: 'Ludhiana, Punjab'
    },
    {
      id: '10',
      name: 'Hybrid Tomato Seeds - BT-305',
      category: 'seed',
      price: 450,
      unit: '100g pack',
      description: 'Premium hybrid tomato seeds with excellent fruit quality and high productivity.',
      image: '🌾',
      stock: 350,
      rating: 4.6,
      reviews: 187,
      seller: 'VeggieSeeds Pro',
      location: 'Nasik, Maharashtra'
    },
    {
      id: '11',
      name: 'Wheat Seeds - PBW-725',
      category: 'seed',
      price: 850,
      unit: '25kg bag',
      description: 'High-yielding wheat variety suitable for irrigated areas. Good for roti making.',
      image: '🌾',
      stock: 600,
      rating: 4.7,
      reviews: 298,
      seller: 'GrainMaster Seeds',
      location: 'Meerut, Uttar Pradesh'
    },
    {
      id: '12',
      name: 'Hybrid Maize Seeds - DHM-117',
      category: 'seed',
      price: 680,
      unit: '5kg pack',
      description: 'Drought-tolerant hybrid maize seeds with excellent grain quality and yield.',
      image: '🌾',
      stock: 280,
      rating: 4.5,
      reviews: 156,
      seller: 'CornFields Ltd',
      location: 'Indore, Madhya Pradesh'
    },

    // Tools
    {
      id: '13',
      name: 'Garden Spade with Wooden Handle',
      category: 'tool',
      price: 280,
      unit: 'piece',
      description: 'Heavy-duty garden spade with ergonomic wooden handle. Perfect for digging and soil preparation.',
      image: '🔧',
      stock: 95,
      rating: 4.3,
      reviews: 67,
      seller: 'ToolMart Agro',
      location: 'Jaipur, Rajasthan'
    },
    {
      id: '14',
      name: 'Pruning Shears - Professional',
      category: 'tool',
      price: 420,
      unit: 'piece',
      description: 'High-quality pruning shears with sharp stainless steel blades. Comfortable grip handle.',
      image: '🔧',
      stock: 120,
      rating: 4.6,
      reviews: 89,
      seller: 'FarmTools Direct',
      location: 'Chandigarh'
    },
    {
      id: '15',
      name: 'Garden Hoe - Wide Blade',
      category: 'tool',
      price: 350,
      unit: 'piece',
      description: 'Wide-blade garden hoe for weeding and soil cultivation. Durable steel construction.',
      image: '🔧',
      stock: 78,
      rating: 4.4,
      reviews: 54,
      seller: 'AgriEquip Store',
      location: 'Lucknow, Uttar Pradesh'
    },
    {
      id: '16',
      name: 'Hand Trowel Set - 3 Pieces',
      category: 'tool',
      price: 180,
      unit: 'set',
      description: 'Set of 3 hand trowels for transplanting, weeding, and soil work. Rust-resistant coating.',
      image: '🔧',
      stock: 145,
      rating: 4.5,
      reviews: 102,
      seller: 'GardenPro Tools',
      location: 'Surat, Gujarat'
    },

    // Equipment
    {
      id: '17',
      name: 'Knapsack Sprayer - 16 Liters',
      category: 'equipment',
      price: 1850,
      unit: 'piece',
      description: 'Manual knapsack sprayer with adjustable nozzle. Ideal for pesticide and fertilizer application.',
      image: '⚙️',
      stock: 65,
      rating: 4.5,
      reviews: 78,
      seller: 'SprayTech Industries',
      location: 'Coimbatore, Tamil Nadu'
    },
    {
      id: '18',
      name: 'Power Tiller - 5HP',
      category: 'equipment',
      price: 28500,
      unit: 'piece',
      description: 'Compact power tiller for small to medium farms. Easy to operate with low maintenance.',
      image: '⚙️',
      stock: 12,
      rating: 4.7,
      reviews: 45,
      seller: 'MechFarm Equipment',
      location: 'Rajkot, Gujarat'
    },
    {
      id: '19',
      name: 'Chaff Cutter Machine - Electric',
      category: 'equipment',
      price: 12500,
      unit: 'piece',
      description: 'Electric chaff cutter for fodder preparation. High efficiency with safety features.',
      image: '⚙️',
      stock: 28,
      rating: 4.4,
      reviews: 67,
      seller: 'AgroMachines Co',
      location: 'Meerut, Uttar Pradesh'
    },
    {
      id: '20',
      name: 'Drip Irrigation Kit - 1 Acre',
      category: 'equipment',
      price: 18500,
      unit: 'kit',
      description: 'Complete drip irrigation system for 1 acre. Includes pipes, drippers, and fittings.',
      image: '⚙️',
      stock: 35,
      rating: 4.8,
      reviews: 134,
      seller: 'WaterSave Systems',
      location: 'Nashik, Maharashtra'
    }
  ]);

  // Use fetched products if available, otherwise use mock products
  const displayProducts = products.length > 0 ? products : mockProducts;

  const getProductById = (id: string) => {
    return displayProducts.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all') return displayProducts;
    return displayProducts.filter(product => product.category === category);
  };

  return (
    <ProductsContext.Provider value={{ products: displayProducts, getProductById, getProductsByCategory }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
