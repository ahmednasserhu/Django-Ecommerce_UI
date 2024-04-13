import { configureStore } from "@reduxjs/toolkit";
import shipment from "./slices/shipment";
import cartitems from "./slices/cartItem";
import wishlists from "./slices/wishlist";
import orders from "./slices/order";
import searchReducer from "./slices/searchReducer";

export default configureStore({
  reducer: {
    shipment: shipment,
    cartitems: cartitems,
    wishlists,
    orders,
    search: searchReducer,
  },
});
