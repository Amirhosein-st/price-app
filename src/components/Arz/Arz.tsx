import React, { useEffect, useState, useRef } from "react";
import "./Arz.scss";
import { GetPriceData } from "../../services/price.service";

interface ArzItem {
  id: string;
  name: string;
  price: { price: number }[];
}

const ArzComponent: React.FC = () => {
  const [arzData, setArzData] = useState<ArzItem[]>([]);
  const [updatedSync, setUpdatedSync] = useState<string>("... در حال بارگزاری ");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const response = await GetPriceData();
      const data = await response.json();
      setArzData(data.arz);
      setUpdatedSync(data.updatedSync);
    } catch (error) {
      console.error("Error fetching arz data:", error);
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
    <div className="arz-container" ref={scrollRef} onScroll={handleScroll}>
      <h2 className="arz-title">قیمت ارز ها:</h2>

      {isRefreshing && <div className="refresh-indicator">در حال آپدیت...</div>}

      <div className="arz-scrollView">
        {arzData.map((arz) => (
          <div key={arz.id} className="arz-item">
            <span className="arz-name">{arz.name}</span>
            <span className="arz-price">
              {formatPrice(arz.price[0]?.price)} تومان
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

export default ArzComponent;
