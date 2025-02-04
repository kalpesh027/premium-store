import { FaExchangeAlt, FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom";

type ProductsProps = {
  productId: string;
  photos: {
    url: string;
    public_id: string
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  name,
  photos,
  stock,
  handler,
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={photos?.[0]?.url} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>

      <div>
        <button
          onClick={() =>
            handler({ productId, price, name, photo: photos[0].url, stock, quantity: 1 })
          }
        >
          <FaPlus />
        </button>
        <Link to ={`/product/${productId}`}><FaExchangeAlt/></Link>

      </div>
    </div>
  );
};

export default ProductCard;
