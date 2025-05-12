import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./home.css";
import { homeData } from "./context/data";

export const LandSimulator = () => {
  const transformRef = useRef(null);
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(null);
  const [home, setHome] = useState(null);
  const [activeFilter, setActiveFilter] = useState("most_expensive");

  useEffect(() => {
    const updateScale = () => {
      if (wrapperRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const scaleX = wrapperWidth / 3820;
        setScale(scaleX);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const onClose = () => {
    setHome(null);
  };

  const filteredHomes = (() => {
    switch (activeFilter) {
      case "most_expensive":
        return [...homeData].sort((a, b) => b.price - a.price).slice(0, 5);
      case "popular":
        return [...homeData].sort((a, b) => b.views - a.views).slice(0, 5);
      case "reserved":
        return homeData.filter((home) => home.reserved);
      default:
        return homeData;
    }
  })();

  return (
    <div className="w100 p-r land-container" ref={wrapperRef}>
      <div className="w100 header-container">
        <div className="w100 df aic jcsb land-header">
          <h1 className="sim-title">Land Simulator</h1>
          <div className="df aic gap-20 actions">
            <p className="homes-filled">
              HOME FILLED {homeData.filter((h) => h.owner).length + 7}/100+
            </p>

            <button
              className={activeFilter === "most_expensive" ? "active" : ""}
              onClick={() => setActiveFilter("most_expensive")}
            >
              Most Expensive
            </button>

            <button
              className={activeFilter === "popular" ? "active" : ""}
              onClick={() => setActiveFilter("popular")}
            >
              Popular
            </button>

            <button
              className={activeFilter === "recent" ? "active" : ""}
              onClick={() => setActiveFilter(null)}
            >
              Soon
            </button>

            <button
              className={activeFilter === "reserved" ? "active" : ""}
              onClick={() => setActiveFilter("reserved")}
            >
              Reserved
            </button>
          </div>
        </div>
      </div>

      <div className="land-image-container">
        {scale !== null && (
          <TransformWrapper
            ref={transformRef}
            minScale={scale}
            initialScale={scale}
            limitToBounds={false}
            limitToBoundsPan={true}
            initialPositionX={0}
            initialPositionY={0}
            doubleClick={{ disabled: true }}
            pinch={{ disabled: false }}
            onInit={(utils) => (transformRef.current = utils)}
            onPanningStop={() => {
              const {
                scale: s,
                positionY,
                positionX,
              } = transformRef.current.state;
              if (
                s === scale ||
                positionX > 50 ||
                positionY > 50 ||
                positionX < -3870 ||
                positionY < -2950
              ) {
                transformRef.current.setTransform(0, 0, scale);
              }
            }}
            onWheelStop={() => {
              const { scale: s } = transformRef.current.state;
              if (s === scale) {
                transformRef.current.setTransform(0, 0, scale);
              }
            }}
          >
            <TransformComponent>
              <div
                className="df jcc p-r land-image"
                style={{
                  position: "relative",
                  width: "3820px",
                  height: "2900px",
                }}
              >
                <div className="ll-v">
                  {homeData.map((s, index) => (
                    <div
                      key={`${s.id}_${index}`}
                      className="df fdc aic p-r cp home"
                      style={{
                        position: "absolute",
                        left: `${(s.x / 200) * 3820}px`,
                        top: `${(s.y / 200) * 2900}px`,
                      }}
                      onClick={() => {
                        setHome(s);
                        transformRef.current.setTransform(0, 0, scale);
                      }}
                    >
                      <img src={s.image} alt="home" className="home-image" />
                      {s.owner && (
                        <div className="home-owner">
                          <img
                            src={s?.owner?.image}
                            alt="owner"
                            className="owner-image"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>
      <div className={`land-modal ${home?.id ? "active" : "close-modal"}`}>
        <div className="land-modal-inner">
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>

          <div className="w100 df aic fdc modal-header">
            <img src={home?.image} alt="house" className="house-image" />
            <div className="modal-title">{home?.title || "Cozy Home"}</div>
          </div>

          <div className="modal-body">
            <p>
              <strong>Price:</strong> ${home?.price.toLocaleString()}
            </p>
            <p>
              <strong>Size:</strong> {home?.size}
            </p>
            <p>
              <strong>Bedrooms:</strong> {home?.bedrooms}
            </p>
            <p>
              <strong>Bathrooms:</strong> {home?.bathrooms}
            </p>
            <p className="description">{home?.description}</p>
          </div>

          {home?.owner && (
            <div className="df fdc modal-owner">
              <p className="fs-20">Owner</p>
              <div className="df aic gap-10">
                <img
                  src={home?.owner?.image}
                  alt="owner"
                  className="owner-avatar"
                />
                <span className="df fdc fs-18">
                  <span>{home?.owner?.name}</span>
                  <u
                    className="fs-14"
                    onClick={() => {
                      window.open(
                        `https://opensea.io/${home?.owner?.x_profile}`,
                        "_blank"
                      );
                    }}
                  >
                    {home?.owner?.x_profile}
                  </u>
                </span>
              </div>
            </div>
          )}

          {home?.reserved && (
            <div className="df fdc modal-owner">
              <p className="fs-20">Reserved By</p>
              <div className="df aic gap-10">
                <img
                  src={home?.reserved?.image}
                  alt="reserved"
                  className="owner-avatar"
                />
                <span className="df fdc fs-18">
                  <span>{home?.reserved?.name}</span>
                  <u
                    className="fs-14"
                    onClick={() => {
                      window.open(
                        `https://opensea.io/${home?.reserved?.x_profile}`,
                        "_blank"
                      );
                    }}
                  >
                    {home?.reserved?.x_profile}
                  </u>
                </span>
              </div>
            </div>
          )}

          <div
            className={`modal-actions ${
              home?.reserved || home?.owner ? "disabled" : ""
            }`}
          >
            <button className="action-button buy">Buy</button>
            <button className="action-button reserve">Reserve</button>
          </div>
        </div>
      </div>
      {activeFilter && (
        <div className="df fdc aic gap-10 results-panel">
          <button className="close-btn" onClick={() => setActiveFilter(null)}>
            ✖
          </button>
          <h2 className="result-title">
            Top {activeFilter?.split("_").join(" ")} Homes
          </h2>
          <div className="df aic gap-20 homes">
            {filteredHomes.map((home) => (
              <div key={home.id} className="result-card">
                <img src={home.image} alt="home" />~
                <div>
                  <p>{home.size}</p>
                  <p>${home.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
