export const fetchProducts = async (page: number, limit: number = 2) => {
  try {
    // Simüle edilmiş API çağrısı
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockProducts = [
      { id: 1, price: '27.5₺', date: '1 Haziran 17:30', title: 'Örgü dinazor' },
      { id: 2, price: '37.5₺', date: '1 Haziran 17:30', title: 'Örgü ördek' },
      { id: 3, price: '45.0₺', date: '2 Haziran 10:00', title: 'Örgü fil' },
      { id: 4, price: '32.0₺', date: '2 Haziran 11:30', title: 'Örgü tavşan' }
    ];

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      products: mockProducts.slice(start, end),
      hasMore: end < mockProducts.length
    };
  } catch (error) {
    console.error('API hatası:', error);
    throw error;
  }
};