import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import styles from "./style.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { IoPricetags } from "react-icons/io5";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import decodeToken from "../../redux/action/decodeToken";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlistAction,
  getWishlistAction,
  removeFromWishlistAction,
} from "../../redux/action/wishlist-action";
import { useNavigate } from "react-router-dom";
import {
  getCartItemsAction,
  addcartitemAction,
  removecartitemAction,
} from "../../redux/action/cartitemaction";

function ProductCard({ product }) {
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [isEyeHovered, setIsEyeHovered] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i}>&#9733;</span>); // Full star
      } else {
        stars.push(<span key={i}>&#9734;</span>); // Empty star
      }
    }
    return stars;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customer_id, setCustomerId] = useState(null);
  const [cart_id, setCartId] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const { wishlists } = useSelector((state) => state.wishlists);
  const { cartitems } = useSelector((state) => state.cartitems);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = decodeToken(token);
        const userId = decodedToken.id;
        setCustomerId(userId);

        try {
          const response = await axios.get(
            `http://localhost:8000/cart/searchcustomercart/${userId}/`
          );
          if (response.data.length > 0 && response.data[0].id) {
            const cartId = response.data[0].id;
            setCartId(cartId);
            dispatch(getCartItemsAction(cartId));
          } else {
            const newCartResponse = await axios.post(
              "http://localhost:8000/cart/",
              { customer_id: userId }
            );
            if (newCartResponse.data && newCartResponse.data.id) {
              const newCartId = newCartResponse.data.id;
              setCartId(newCartId);
              dispatch(getCartItemsAction(newCartId));
            } else {
              console.error(
                "Error creating new cart: Response data or cart ID is undefined."
              );
            }
          }
        } catch (error) {
          console.error("Error fetching or creating cart:", error);
        }
      } else {
        console.log("Token does not exist");
        // Redirect to login or handle the absence of token
      }
    };

    checkToken();
  }, [dispatch]);

  const handleAddToWishlist = (e, productId) => {
    e.preventDefault();

    if (!customer_id) {
      navigate("/signup");
      return;
    }

    if (isInWishlist) {
      const wishlistItem = wishlists.find((item) => item.product_id === productId);
      if (wishlistItem) {
        dispatch(removeFromWishlistAction(wishlistItem.id));
      }
    } else {
      const data = {
        id: 1,
        customer_id: customer_id,
        product_id: productId,
      };
      dispatch(addToWishlistAction(data));
    }
  };

  useEffect(() => {
    setIsInWishlist(wishlists.some((item) => item.product_id === product.id));
  }, [wishlists, product.id]);

  useEffect(() => {
    if (cart_id !== null) {
      const exist = cartitems.some(
        (item) => item.product_id === product.id && item.cart_id === cart_id
      );
      setIsInCart(exist);
    }
  }, [cartitems, product.id, cart_id]);

  const AddCartitemSubmit = (productId) => {
    const data = {
      id: 1,
      product_id: productId,
      quantity: 1,
      cart_id: cart_id,
    };

    if (customer_id) {
      const cartItem = cartitems.find(
        (item) => item.product_id === productId && item.cart_id === cart_id
      );
      if (cartItem) {
        dispatch(removecartitemAction(cartItem.id));
      } else {
        dispatch(addcartitemAction(data));
      }
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className={styles.productcard}>
      <form onSubmit={(e) => handleAddToWishlist(e, product.id)}>
        <input type="hidden" name="product_id" value={product.id} readOnly />
        <button className="border-0 bg-none">
          {isInWishlist ? (
            <MdFavorite
              className={`${styles.icon} ${styles.favoriteIcon}`}
              onMouseEnter={() => setIsFavoriteHovered(true)}
              onMouseLeave={() => setIsFavoriteHovered(false)}
            />
          ) : (
            <MdFavoriteBorder
              className={`${styles.icon} ${styles.favoriteIcon}`}
              onMouseEnter={() => setIsFavoriteHovered(true)}
              onMouseLeave={() => setIsFavoriteHovered(false)}
            />
          )}
        </button>
      </form>

      {isFavoriteHovered && (
        <Badge
          className={`${styles.badgeHover} ${styles.favoriteBadge}`}
          pill
          variant="danger"
        >
          Add to Wishlist
        </Badge>
      )}

      <IoEyeOutline
        className={`${styles.icon} ${styles.eyeIcon}`}
        onMouseEnter={() => setIsEyeHovered(true)}
        onMouseLeave={() => setIsEyeHovered(false)}
      />

      {isEyeHovered && (
        <Badge
          className={`${styles.badgeHover} ${styles.eyeBadge}`}
          pill
          variant="primary"
        >
          View Details
        </Badge>
      )}

      <Card.Img
        variant="top"
        src="src\assets\istockphoto-1436061606-612x612.jpg"
        className={styles.cardImage}
      />

      <div className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{product.name}</Card.Title>

        <div className={styles.priceRectangle}>
          <IoPricetags className={styles.priceIcon} />${product.price}
        </div>

        <div className={styles.rating}>
          {renderStars(product.rating)} ({product.rating})
        </div>

        <Button
          variant="primary"
          className={styles.customButton}
          onClick={() => AddCartitemSubmit(product.id)}
        >
          <FaShoppingCart className={styles.cartIcon} />
          {isInCart ? <span>&nbsp; remove from cart</span> : <span>&nbsp; Add to cart</span>}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;