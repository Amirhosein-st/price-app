import React, { useEffect, useState, useRef } from "react";
import "./Crypto.scss";
import { GetPriceData } from "../../services/price.service";

interface CryptoItem {
  id: string;
  name: string;
  price: { price: number; toman: number }[];
}

const CryptoComponent: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoItem[]>([]);
  const [updatedSync, setUpdatedSync] = useState<string>(
    "... در حال بارگزاری "
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const response = await GetPriceData();
      const data = await response.json();
      setCryptoData(data.crypto);
      setUpdatedSync(data.updatedSync);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR");
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      if (scrollTop < -100 && !isRefreshing) {
        fetchData();
      }
    }
  };

  return (
    <div className="crypto-container" ref={scrollRef} onScroll={handleScroll}>
      <div className="crypto-scrollView">
        <h2 className="crypto-title">قیمت ارز های دیجیتال:</h2>
        {cryptoData.map((crypto) => (
          <div key={crypto.id} className="crypto-item">
            <span className="crypto-name">{crypto.name}</span>
            <span>
              <span className="crypto-price">
                {formatPrice(crypto.price[0]?.price)} دلار
              </span>
              <span className="crypto-price"> - </span>
              <span className="crypto-price">
                {formatPrice(crypto.price[0]?.toman)} تومان
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="last-updated">
        <span className="last-updated-text">{updatedSync}</span>
      </div>
    </div>
  );
};

export default CryptoComponent;
