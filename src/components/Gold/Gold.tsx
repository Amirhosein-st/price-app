import React, { useEffect, useState, useRef } from "react";
import "./Gold.scss";
import { GetPriceData } from "../../services/price.service";

interface GoldItem {
  id: string;
  name: string;
  price: { price: number }[];
}

const GoldComponent: React.FC = () => {
  const [goldData, setGoldData] = useState<GoldItem[]>([]);
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
      setGoldData(data.gold);
      setUpdatedSync(data.updatedSync);
    } catch (error) {
      console.error("Error fetching gold data:", error);
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
    <div className="gold-container" ref={scrollRef} onScroll={handleScroll}>
      <div className="gold-scrollView">
        <h2 className="gold-title">قیمت طلا و سکه:</h2>

        {goldData.map((gold) => (
          <div key={gold.id} className="gold-item">
            <span className="gold-name">{gold.name}</span>
            <span className="gold-price">
              {formatPrice(gold.price[0]?.price)} تومان
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

export default GoldComponent;
