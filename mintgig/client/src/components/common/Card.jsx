import React from 'react';

export const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-brand-border/80 shadow-sm p-6 ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-brand/40 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
