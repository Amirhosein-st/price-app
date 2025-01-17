import React, { useEffect, useState } from "react";
import "./FristPage.scss";
import { GetPriceData } from "../../services/price.service";

const FristPageComponent: React.FC = () => {
  const [arzData, setArzData] = useState<any[]>([]);
  const [goldData, setGoldData] = useState<any[]>([]);
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await GetPriceData();
      const data = await response.json();
      if (data) {
        setArzData(data.arz);
        setGoldData(data.gold);
        setCryptoData(data.crypto);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (price: any) => {
    return price.toLocaleString("fa-IR");
  };

  return (
    <div className="FristPage-container">
      <div className="FristPage-scrollView">
        {!isLoading && (
          <>
            <h2 className="FristPage-title">قیمت طلا و سکه:</h2>
            {goldData.map((gold) => (
              <div key={gold.id} className="FristPage-item">
                <span className="FristPage-name">{gold.name}</span>
                <span className="FristPage-price">
                  {formatPrice(gold.price[0]?.price)} تومان
                </span>
              </div>
            ))}
          </>
        )}

        {!isLoading && (
          <>
            <h2 className="FristPage-title">قیمت ارز ها:</h2>
            {arzData
              .filter((arz) =>
                ["دلار آمریکا", "یورو", "لیر ترکیه", "درهم امارات"].includes(
                  arz.name
                )
              )
              .map((arz) => (
                <div key={arz.id} className="FristPage-item">
                  <span className="FristPage-name">{arz.name}</span>
                  <span className="FristPage-price">
                    {formatPrice(arz.price[0]?.price)} تومان
                  </span>
                </div>
              ))}
          </>
        )}

        {!isLoading && (
          <>
            <h2 className="FristPage-title">قیمت ارز های دیجیتال:</h2>
            {cryptoData
              .filter((crypto) =>
                ["bitcoin", "ethereum", "tether", "binance coin"].includes(
                  crypto.name.toLowerCase()
                )
              )
              .map((crypto) => (
                <div key={crypto.id} className="FristPage-cryptoItem">
                  <span className="FristPage-cryptoName">{crypto.name}</span>
                  <span>
                    {" "}
                    <span className="FristPage-cryptoPrice">
                      {" "}
                      {formatPrice(crypto.price[0]?.price)} دلار{" "}
                    </span>
                    <span className="FristPage-cryptoPrice"> - </span>
                    <span className="FristPage-cryptoPrice">
                      {" "}
                      {formatPrice(crypto.price[0]?.toman)} تومان{" "}
                    </span>
                  </span>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FristPageComponent;
