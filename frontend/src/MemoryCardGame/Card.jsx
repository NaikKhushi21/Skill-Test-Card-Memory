import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { styled } from "@mui/system";
import PropTypes from "prop-types";

const CardContainer = styled(Box)({
  perspective: "1000px",
  cursor: "pointer",
  width: "100%",
  maxWidth: "150px",
  height: "150px",
  margin: "0 auto",
  '@media (max-width: 768px)': {
    maxWidth: "130px",
    height: "130px",
  },
  '@media (max-width: 600px)': {
    maxWidth: "110px",
    height: "110px",
  },
});

const CardInner = styled(animated.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
});

const CardFront = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2c2c54",
  border: "2px solid #00aaff",
  borderRadius: "8px",
  transform: "rotateY(180deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardBack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#2c2c54",
  border: "2px solid #00aaff",
  borderRadius: "8px",
  transform: "rotateY(0deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const Card = ({ card, flipped, matched, handleClick }) => {
  // Animation for card flip
  const { transform } = useSpring({
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 500, friction: 30 },
  });

  return (
    <CardContainer onClick={handleClick}>
      <CardInner style={{ transform }}>
        <CardFront>
          <img src={card.image} alt="Card front" style={{ width: "140%", height: "140%" }} />
        </CardFront>
        <CardBack>
          <img src="/images/Back2.png" alt="Card back" style={{ width: "140%", height: "140%" }} />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default Card; 