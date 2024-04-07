import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import ProductsList from "./components/Products/ProductList";

function Helw() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      <div className="row">
        <div className="col-md-2">
          <Sidebar handleChange={handleChange} />
        </div>
        <div className="col-md-10">
          <ProductsList selectedCategory={selectedCategory} />{" "}
        </div>
      </div>
    </>
  );
}

export default Helw;
