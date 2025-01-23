
import React, { useState } from 'react';
import { Heart, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductDetailsQuery } from '../redux/api/productAPI';
import { useParams } from 'react-router-dom';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['white', 'red'];

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600080971293-8c2d76e864ce?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600080971544-8c1876bb3e8b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600080971674-c2b6a1e7a4a5?auto=format&fit=crop&q=80&w=800'
];


const ProductDetails = () => {

  const params = useParams();
  const{isLoading, isError}= useProductDetailsQuery(params.id!);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('white');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % PRODUCT_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="relative md:h-[600px] flex flex-col md:flex-row gap-4">
          {/* Thumbnails - Vertical on desktop */}
          <div className="hidden md:flex md:flex-col gap-4 md:h-full md:pr-4">
            {PRODUCT_IMAGES.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative w-full">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <div 
                className="absolute inset-0 flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {PRODUCT_IMAGES.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {PRODUCT_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Image (Desktop Only) */}
          <div className="hidden md:block flex-1 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={PRODUCT_IMAGES[currentImageIndex]}
              alt="Product main view"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="h-[500px] md:h-[600px] overflow-y-auto px-4 custom-scrollbar">
          <h1 className="text-3xl font-bold">Havic HV G-92 Gamepad</h1>
          <div className="flex items-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
            <span className="text-gray-500">(150 Reviews)</span>
            <span className="text-green-500 ml-2">In Stock</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold">$192.00</span>
          </div>
          <p className="mt-4 text-gray-600">
            PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess
            free removal Pressure sensitive.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Colours:</h3>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Size:</h3>
            <div className="flex gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded transition-all ${
                    selectedSize === size
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button className="flex-1 bg-red-500 text-white rounded py-2 hover:bg-red-600 transition-colors">
              Buy Now
            </button>
            <button className="p-2 border rounded hover:bg-gray-100 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="border rounded p-4">
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Free Delivery</h4>
                  <p className="text-sm text-gray-500">Enter your postal code for Delivery Availability</p>
                </div>
              </div>
            </div>
            <div className="border rounded p-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Return Delivery</h4>
                  <p className="text-sm text-gray-500">Free 30 Days Delivery Returns. Details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails