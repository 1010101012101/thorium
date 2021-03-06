import React from "react";

const Torpedo = ({ state, type }) => {
  const style = {
    opacity: state !== "loaded" ? 0 : 1,
    top: state === "loaded" || state === "fired" ? "86%" : "2px",
    left: state === "fired" ? "70px" : "3px",
    transition: `opacity 1s ease-in ${
      state === "loaded" ? "" : "2s"
    }, top 3s ease-in-out, left 0.2s ease-in`
  };
  let color = "rgb(200, 120, 255)";
  switch (type) {
    case "photon":
      color = "rgb(255,0,0)";
      break;
    case "quantum":
      color = "rgb(0,80,255)";
      break;
    case "probe":
      color = "rgb(40,140,40)";
      break;
    case "other":
    default:
      color = "rgb(200, 120, 255)";
      break;
  }

  return (
    <div className="torpedoHolder">
      <svg
        className="torpedo"
        style={style}
        width="100%"
        height="100%"
        viewBox="0 0 32 10"
      >
        <g transform="matrix(1,0,0,1,-199,-136)">
          <path
            style={{ fill: color }}
            d="M209,136L226,136C228.761,136 231,138.239 231,141C231,141 231,141 231,141C231,143.761 228.761,146 226,146C220,146 210,146 204,146C201.239,146 199,143.761 199,141C199,141 199,141 199,141C199,139.674 199.527,138.402 200.464,137.464C201.402,136.527 202.674,136 204,136L208,136L208,139L206,139L206,136L205,136L205,140L209,140L209,136ZM209,144L209,143L204,143L204,144L209,144ZM213,144L213,143L210,143L210,144L213,144ZM216,144L216,143L215,143L215,144L216,144ZM218,144L218,143L217,143L217,144L218,144ZM225,144L225,143L222,143L222,144L225,144ZM230,142L230,141L200,141L200,142L230,142ZM221,140L221,136L220,136L220,139L211,139L211,136L210,136L210,140L221,140ZM226,140L226,136L225,136L225,139L223,139L223,136L222,136L222,140L226,140Z"
          />
        </g>
      </svg>
    </div>
  );
};

export default Torpedo;
