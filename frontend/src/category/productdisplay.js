import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerProducts = ({ sellerId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch the seller's products from the server
    axios.get(`/products/${sellerId}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching seller products:', error);
      });
  }, [sellerId]);

  const handleDeleteProduct = (productId) => {

    axios.delete(`/products/${productId}`)
      .then(() => {
        // Remove the deleted product from the products list
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
        console.log('Product deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <div>
      <h2>Your Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.description}
            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerProducts;
