'use client';

import type React from 'react';
import { useState } from 'react';
import type { CartItem as ItemType } from '@/constants/interfaces';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type Props = {
  item: ItemType;
  isSelected: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
};

const CartItem: React.FC<Props> = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onRemove,
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(item.productId || 0, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(item.productId || 0, newQuantity);
    }
  };

  const handleProductClick = () => {
    navigate(`/books/${item.productId}`);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center py-4 border-b gap-2 md:gap-0 p-4 bg-card">
      {/* Desktop: Checkbox */}
      <div className="hidden md:flex w-12 justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect(item.productId || 0, checked as boolean)
          }
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 md:mr-4 flex items-center">
        {/* Mobile: Checkbox */}
        <div className="flex items-center md:hidden mr-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) =>
              onSelect(item.productId || 0, checked as boolean)
            }
          />
        </div>

        <div
          className="flex flex-1 items-start cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
          onClick={handleProductClick}
        >
          {/* Product Image */}
          <div className="w-16 md:w-20 mr-3 md:mr-4 flex-shrink-0 border rounded-sm overflow-hidden bg-white">
            <img
              src={item.thumbnailUrl || '/placeholder.svg'}
              alt={item.name || 'Product'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm md:text-base mb-1 line-clamp-2 hover:text-primary transition-colors">
              {item.name || 'Unnamed Product'}
            </h3>
            {/* Mobile: Show price here */}
            <div className="md:hidden mt-2">
              <div className="flex flex-col">
                <span className="font-semibold text-destructive text-sm">
                  {(item.price || 0).toLocaleString()}₫
                </span>
                {item.originalPrice &&
                  item.originalPrice > (item.price || 0) && (
                    <span className="text-muted-foreground line-through text-xs">
                      {(item.originalPrice || 0).toLocaleString()}₫
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Remove button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.productId || 0)}
          className="md:hidden text-muted-foreground hover:text-destructive h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile: Quantity and Total in one row */}
      <div className="flex items-center justify-between md:hidden px-2 pl-8">
        {/* Quantity Control */}
        <div className="flex items-center">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <div className="font-semibold text-destructive text-sm">
            {((item.price || 0) * quantity).toLocaleString()}₫
          </div>
        </div>
      </div>

      {/* Desktop: Unit Price */}
      <div className="hidden md:block w-32 text-center">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-destructive">
            {(item.price || 0).toLocaleString()}₫
          </span>
          {item.originalPrice && item.originalPrice > (item.price || 0) && (
            <span className="text-muted-foreground line-through text-xs">
              {(item.originalPrice || 0).toLocaleString()}₫
            </span>
          )}
        </div>
      </div>

      {/* Desktop: Quantity Control */}
      <div className="hidden md:flex w-32 items-center justify-center">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Desktop: Subtotal */}
      <div className="hidden md:block w-32 text-center">
        <span className="font-semibold text-destructive">
          {((item.price || 0) * quantity).toLocaleString()}₫
        </span>
      </div>

      {/* Desktop: Remove Button */}
      <div className="hidden md:flex w-12 justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.productId || 0)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
