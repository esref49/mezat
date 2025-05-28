'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchProducts } from 'lib/fetchProducts';
import { ProductCard } from '@components/ProductCard';

interface Product {
  id: number;
  price: string;
  date: string;
  title: string;
}

export const Feed = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadProducts = useCallback(async (currentPage: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchProducts(currentPage);
      setProducts(prev => [...prev, ...data.products]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    loadProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const lastProductRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product, index) => (
        <div
          key={`${product.id}-${index}`}
          ref={index === products.length - 1 ? lastProductRef : null}
        >
          <ProductCard
            price={product.price}
            date={product.date}
            title={product.title}
          />
        </div>
      ))}

      {loading && (
        <div className="col-span-full flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!hasMore && !loading && (
        <div className="col-span-full text-center py-4 text-gray-500">
          Daha fazla ürün bulunmamaktadır
        </div>
      )}
    </div>
  );
};