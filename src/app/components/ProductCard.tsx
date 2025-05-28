'use client';

interface ProductCardProps {
  price: string;
  date: string;
  title: string;
}

export const ProductCard = ({ price, date, title }: ProductCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-lg text-indigo-600">{price}</span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <h3 className="text-gray-800 font-medium">{title}</h3>
    </div>
  );
};