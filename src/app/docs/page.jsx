"use client";
import Head from "next/head";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import swaggerConfig from "../swagger-config.json";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "600", "700"] });

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalEndpoints, setTotalEndpoints] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let count = 0;
    const categoryCount = {};

    if (swaggerConfig && swaggerConfig.paths) {
      Object.entries(swaggerConfig.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, details]) => {
          if (details && details.tags) {
            count++;
            details.tags.forEach((tag) => {
              if (!categoryCount[tag]) {
                categoryCount[tag] = 0;
              }
              categoryCount[tag]++;
            });
          }
        });
      });
    }

    setTotalEndpoints(count);
    setCategories(Object.entries(categoryCount).map(([name, count]) => ({ name, count })));
  }, [swaggerConfig]);

  return (
    <>
      <Head>
        <title>VelynAPI</title>
        <meta name="description" content="VelynApi is a free, simple REST API." />
      </Head>

      <main className={`min-h-screen flex flex-col items-center ${poppins.className}`} style={{ backgroundColor: "#0d0d1a", color: "white" }}>
        <Analytics />
        <SpeedInsights />

        <div className="container">
          <h1 className="title">VelynAPI Dashboard</h1>
          <p className="subtitle">Total Endpoints: {totalEndpoints}</p>

          <div className="category-container">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-button ${selectedCategory === category.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  {category.name} ({category.count})
                  <span className="arrow">{selectedCategory === category.name ? "▲" : "▶"}</span>
                </button>
              ))
            ) : (
              <p className="empty-text">Tidak ada kategori tersedia</p>
            )}
          </div>

          {selectedCategory && (
            <div className="modal">
              <span className="close-btn" onClick={() => setSelectedCategory(null)}>✖</span>

              <div className="swagger-container">
                <SwaggerUI
                  spec={{
                    ...swaggerConfig,
                    paths: Object.fromEntries(
                      Object.entries(swaggerConfig.paths).filter(([_, value]) =>
                        Object.values(value).some((method) => method.tags?.includes(selectedCategory))
                      )
                    ),
                  }}
                  docExpansion="none"
                  defaultModelsExpandDepth={-1}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .container {
          width: 90%;
          max-width: 1200px;
          text-align: center;
          padding: 30px;
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .subtitle {
          font-size: 18px;
          font-weight: 400;
          color: #b0b0b0;
          margin-bottom: 20px;
        }

        .category-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .category-button {
          width: 200px;
          background: linear-gradient(135deg, #6e45e2, #88d3ce);
          padding: 12px 16px;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        .category-button:hover {
          background: linear-gradient(135deg, #5a35c9, #72b7a4);
          transform: scale(1.05);
        }

        .category-button.active {
          background: linear-gradient(135deg, #4b1fa0, #60a091);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4);
        }

        .arrow {
          font-size: 16px;
          transition: transform 0.3s ease-in-out;
        }

        .empty-text {
          font-size: 16px;
          color: #b0b0b0;
        }

        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 800px;
          height: 85vh;
          background: #15102c;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          overflow-y: auto;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in-out;
        }

        .swagger-container {
          padding: 10px;
          background: #1a1a3d;
          border-radius: 10px;
          max-height: 100%;
          overflow-y: auto;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          color: white;
          background: red;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.3s ease-in-out;
        }

        .close-btn:hover {
          background: darkred;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 28px;
          }

          .category-button {
            width: 100%;
            font-size: 14px;
          }

          .modal {
            width: 95%;
            height: 90vh;
          }

          .swagger-container {
            padding: 5px;
          }
        }
      `}</style>
    </>
  );
}
