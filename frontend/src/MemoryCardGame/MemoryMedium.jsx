import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import Card from "./Card"; // Import the Card component
import background from "../assets/images/mode1.gif";
import bgMusic from "../assets/audio/memory-bg.mp3";
import axios from "axios";

const defaultDifficulty = "Medium";

// Card Images
const cardImages = [
    { id: 1, image: "/images/meteor.png" },
    { id: 2, image: "/images/meteor.png" },
    { id: 3, image: "/images/moon.png" },
    { id: 4, image: "/images/moon.png" },
    { id: 5, image: "/images/comet.png" },
    { id: 6, image: "/images/comet.png" },
  ];

// Audio files for matching and final congratulation
const matchAudioFiles = [
  "/audio/wonderful.mp3",
  "/audio/NiceJob.mp3",

];

const congratsAudio = "/audio/congrats.mp3"; // Final congratulations audio

// Shuffle Logic
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

// Memoize the card images to prevent unnecessary recreations
const preloadImages = () => {
  cardImages.forEach(card => {
    const img = new Image();
    img.src = card.image;
  });
  
  // Also preload the card back
  const backImg = new Image();
  backImg.src = "/images/Back2.png";
};

const saveGameData = async (gameData) => {
  try {
    const response = await axios.post("http://localhost:5001/api/memory/save", gameData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Game data saved successfully", response.data);
  } catch (error) {
    console.error("Error saving game data:", error.response ? error.response.data : error.message);
  }
};

// Styled Components
const StyledGameContainer = styled(Box)(({ theme, mouseDisabled }) => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  pointerEvents: mouseDisabled ? "none" : "auto",
  padding: "20px 10px 80px 10px",
  overflowX: "hidden",
  animation: "fadeIn 0.4s ease",
  "@keyframes fadeIn": {
    from: { 
      opacity: 0.7,
      backgroundColor: "rgba(0, 31, 63, 0.3)"
    },
    to: { 
      opacity: 1,
      backgroundColor: "transparent" 
    }
  }
}));

const PixelButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
  '@media (max-width: 768px)': {
    fontSize: "12px",
    padding: "10px 20px",
  }
}));

const PixelBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#ff4d4f",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  position: "fixed", 
  bottom: "20px",
  left: "20px",
  zIndex: 100,
  '@media (max-width: 768px)': {
    fontSize: "10px",
    padding: "8px 16px",
  },
  '@media (max-width: 600px)': {
    fontSize: "8px",
    padding: "6px 12px",
  },
}));

const PixelTimerBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  position: "fixed", 
  bottom: "20px",
  right: "20px",
  zIndex: 100,
  '@media (max-width: 768px)': {
    fontSize: "10px",
    padding: "8px 16px",
  },
  '@media (max-width: 600px)': {
    fontSize: "8px",
    padding: "6px 12px",
  },
}));

const PixelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive', // Pixelated font style
  fontSize: '24px',
  color: '#fff',  // White text to stand out on the background
  letterSpacing: '1px',
  textShadow: `
    -1px -1px 0 #ff0000,  
    1px -1px 0 #ff7f00, 
    1px 1px 0 #ffd700, 
    -1px 1px 0 #ff4500`,  // Pixelated text shadow
}));

const PixelButtonModal = styled(Button)(({ theme }) => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive', // Pixelated font style
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#2c2c54',  // Matching the game's background color
  border: '2px solid #00d9ff', // Matching the pixel border
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Subtle shadow for pixel look
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px', // Pixel rounded corners
};

const MemoryMedium = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialReveal, setInitialReveal] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  const [bgVolume] = useState(parseInt(localStorage.getItem("bgVolume"), 10) || 0);
  const [sfxVolume] = useState(parseInt(localStorage.getItem("sfxVolume"), 10) || 0);
  const audioRef = useRef(null);
  const [audioIndex, setAudioIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleSaveNewGame = () => {
    saveGameData({
        userID: localStorage.getItem("userID"),
        gameDate: new Date(),
        failed: failedAttempts,
        difficulty: defaultDifficulty,
        completed: 0,
        timeTaken: timer,
    });
  };
  
  const handleNewGame = () => {
   
    
    setCards(shuffleArray(cardImages));
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0); // Reset audio index

    
    const mouseDisableDuration = 2000;
    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);  // Re-enable mouse events after mouseDisableDuration
    }, mouseDisableDuration);

  
    setTimeout(() => {
      setInitialReveal(false);
      setTimerActive(true);
   
    }, 1500);
  };
  const handleBackButton = () => {
    setOpenModal(true); // Show the confirmation modal
  };

  const handleModalYes = () => {
    setOpenModal(false);
    // Save the current game state
    handleSaveNewGame();
    localStorage.removeItem("gameCompleted"); // Remove game completion flag
    navigate("/play"); // Navigate to play
  };

  const handleModalNo = () => {
    setOpenModal(false); // Close the modal and resume game
  };
  
 
  useEffect(() => {
    // Preload all card images for better performance
    preloadImages();
    
    handleNewGame();
    const handleFirstClick = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.volume = bgVolume / 100;
        audioRef.current.play().catch((error) => console.error("Audio play error:", error));
        setMusicStarted(true);
      }
    };
    document.addEventListener("click", handleFirstClick);

    // Ensure opacity is set to 1 when component mounts
    document.body.style.opacity = '1';
    document.body.style.animation = '';

    return () => {
      document.removeEventListener("click", handleFirstClick);
      // Reset opacity when component unmounts
      document.body.style.opacity = '1';
      document.body.style.animation = '';
    };
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Optimize useEffect for card matching
  useEffect(() => {
    if (flippedCards.length !== 2) return;
    
    const [card1, card2] = flippedCards;
    
    // Use a variable to track if this effect has already matched cards
    let hasMatched = false;
    
    const matchTimer = setTimeout(() => {
      if (card1.image === card2.image) {
        hasMatched = true;
        setMatchedCards((prev) => [...prev, card1.id, card2.id]);
        
        // Only play audio if we haven't reached the end
        if (audioIndex < matchAudioFiles.length) {
          // Use a cached audio object for better performance
          const nextAudio = new Audio(matchAudioFiles[audioIndex]);
          nextAudio.volume = sfxVolume / 100;
          
          // Use a promise to handle audio completion
          const playPromise = nextAudio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setAudioIndex(audioIndex + 1);
              })
              .catch(error => console.error("Audio play error:", error));
          }
        }
      } else {
        setFailedAttempts((prev) => prev + 1);
      }
      
      setFlippedCards([]);
    }, 1000);
    
    // Clean up the timeout if the component unmounts
    return () => clearTimeout(matchTimer);
  }, [flippedCards, audioIndex, sfxVolume]);

  
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
        // Play the congratulations audio
        const congrats = new Audio(congratsAudio);
        congrats.volume = sfxVolume / 100;
        congrats.play();

        // Stop the timer before saving the game data
        setTimerActive(false);

        // Ensure the game data is saved only once
        const saveData = async () => {
            try {
                await saveGameData({
                    userID,
                    gameDate: new Date(),
                    failed: failedAttempts,
                    difficulty: defaultDifficulty,
                    completed: 1,  
                    timeTaken: timer,
                });
                localStorage.setItem("gameCompleted", "true");
                setTimeout(() => navigate("/congt-normal"), 1000);
            } catch (error) {
                console.error("Error saving game data:", error);
            }
        };

        saveData();
    }
}, [matchedCards, cards.length, navigate, sfxVolume, failedAttempts, timer]);


  const userID = localStorage.getItem("userID"); // ✅ Fetch from local storage or auth context
  if (!userID) {
    console.error("Error: userID is missing.");
    return;
  }

  // Optimize card click handler with useCallback to prevent recreation on every render
  const handleCardClick = useCallback((card) => {
    if (!matchedCards.includes(card.id) && flippedCards.length < 2 && !flippedCards.some((c) => c.id === card.id)) {
      setFlippedCards((prev) => [...prev, card]);
    }
  }, [matchedCards, flippedCards]);

  return (
    <StyledGameContainer mouseDisabled={mouseDisabled}>
      <audio ref={audioRef} src={bgMusic} loop />
      
      {/* Back button at top left */}
      <Box sx={{ 
        position: 'absolute', 
        top: '20px',
        left: '20px',
        zIndex: 100
      }}>
        <PixelButton onClick={handleBackButton}>
          Back
        </PixelButton>
      </Box>
      
      {/* Card grid centered */}
      <Grid container spacing={10} justifyContent="center" sx={{ maxWidth: 800, margin: "0 auto", marginTop: "-40px" }}>
        {cards.map((card) => (
          <Grid item xs={6} sm={4} key={card.id}> {/* 3 cards per row on larger screens, 2 per row on mobile */}
            <Card
              card={card}
              handleClick={() => handleCardClick(card)}
              flipped={initialReveal || flippedCards.some((c) => c.id === card.id) || matchedCards.includes(card.id)}
              matched={matchedCards.includes(card.id)}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Learning Moments and Timer at bottom */}
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      
      {/* New Game button centered at bottom */}
      <Box sx={{ 
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100
      }}>
        <PixelButton onClick={() => { handleSaveNewGame(); handleNewGame(); }}>
          New Game
        </PixelButton>
      </Box>

      <Modal open={openModal} onClose={handleModalNo}>
        <Box sx={modalStyle}>
          <PixelTypography variant="h6">
            Are you sure you want to go back to the play page?
          </PixelTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
            <PixelButtonModal onClick={() => { handleSaveNewGame(); handleModalYes(); }} variant="contained" color="primary">
              Yes
            </PixelButtonModal>
            <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary">
              No
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>
    </StyledGameContainer>
  );
};



export default MemoryMedium;
