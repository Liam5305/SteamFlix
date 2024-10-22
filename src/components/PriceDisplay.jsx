// src/components/PriceDisplay.jsx
import React from 'react';

export function PriceDisplay({ price, isOriginal = false }) {
  if (!price) return null;
  
  if (typeof price === 'string' && isNaN(price)) {
    return <span>{price}</span>;
  }

  try {
    const formatter = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    });
    
    const formattedPrice = formatter.format(parseFloat(price));
    return (
      <span className={isOriginal ? 'text-gray-400 line-through' : 'text-green-400'}>
        {formattedPrice}
      </span>
    );
  } catch (error) {
    console.error('Error formatting price:', error);
    return <span>{price}</span>;
  }
}

export default PriceDisplay;