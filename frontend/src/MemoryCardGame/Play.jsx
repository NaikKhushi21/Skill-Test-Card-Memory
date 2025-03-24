import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import backgroundGif from "../assets/images/play.gif";
import calmBackground from "../assets/images/calm-wallpaper.jpg";
import backgroundMusic from "../assets/audio/background-music.mp3";
import buttonHoverSound from "../assets/audio/button-hover.mp3";
import buttonClickSound from "../assets/audio/button-click.mp3";
import { X } from "lucide-react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Zoom,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import "./Play.css";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "300px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};

const modalPlayStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    backgroundColor: "#1e1e2e",
    border: "2px solid #4a4e69",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "600px",
    height: "200px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};

const Play = () => {
  const navigate = useNavigate();
  const [SettingsmodalIsOpen, setModalSettingIsOpen] = useState(false);
  const [PlaymodalIsOpen, setModalPlayIsOpen] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [isCalmMode, setIsCalmMode] = useState(false);
  
  const [bgVolume, setBgVolume] = useState(
    localStorage.getItem("bgVolume") !== null ? parseInt(localStorage.getItem("bgVolume"), 10) : 50
  );
  const [sfxVolume, setSfxVolume] = useState(
    localStorage.getItem("sfxVolume") !== null ? parseInt(localStorage.getItem("sfxVolume"), 10) : 50
  );

  const [mutedBg, setMutedBg] = useState(false);
  const [mutedSfx, setMutedSfx] = useState(false);

  const bgAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    bgAudioRef.current = new Audio(backgroundMusic);
    hoverAudioRef.current = new Audio(buttonHoverSound);
    clickAudioRef.current = new Audio(buttonClickSound);

    const bgAudio = bgAudioRef.current;
    bgAudio.loop = true;
    bgAudio.volume = bgVolume / 100;

    const startMusic = () => {
      bgAudio.play().catch((error) => console.error("Autoplay failed:", error));
    };

    document.addEventListener("click", startMusic, { once: true });

    return () => {
      document.removeEventListener("click", startMusic);
      bgAudio.pause();
      bgAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = bgVolume / 100;
    }
    localStorage.setItem("bgVolume", bgVolume);
  }, [bgVolume]);

  useEffect(() => {
    hoverAudioRef.current.volume = sfxVolume / 100;
    clickAudioRef.current.volume = sfxVolume / 100;
    localStorage.setItem("sfxVolume", sfxVolume);
  }, [sfxVolume]);

  const handleBgVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setBgVolume(newVolume);
    setMutedBg(newVolume === 0);
  };

  const handleSfxVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setSfxVolume(newVolume);
    setMutedSfx(newVolume === 0);
  };

  const toggleCalmMode = () => {
    setIsCalmMode((prev) => !prev);
    playClickSound();
  };

  const playHoverSound = () => {
    hoverAudioRef.current.currentTime = 0;
    hoverAudioRef.current.play().catch((error) =>
      console.error("Hover sound playback failed:", error)
    );
  };

  const playClickSound = () => {
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play().catch((error) =>
      console.error("Click sound playback failed:", error)
    );
  };

  const SettingopenModal = () => {
    setModalSettingIsOpen(true);
    playClickSound();
  };

  const SettingcloseModal = () => {
    setModalSettingIsOpen(false);
    playClickSound();
  };

  const PlayopenModal = () => {
    playClickSound();
    setModalPlayIsOpen(true);
  };

  const PlaycloseModal = () => {
    playClickSound();
    setModalPlayIsOpen(false);
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    playClickSound();
  };

  const handlePlay = () => {
    playClickSound();
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("UserID is missing. Please log in again.");
      return;
    }
    localStorage.setItem("gameStarted", "true");

    // Add a slight fade transition before navigating to the game
    document.body.style.animation = 'fadeOut 0.25s ease';
    document.body.style.opacity = '0.7';
    document.body.style.backgroundColor = 'rgba(0, 31, 63, 0.3)';
    
    setTimeout(() => {
      // Reset document opacity before navigation to prevent tint
      document.body.style.animation = '';
      document.body.style.opacity = '1';
      document.body.style.backgroundColor = '';
      
      if (isCalmMode) {
        if (difficulty === "red") {
          navigate("/calm-hard");
        } else if (difficulty === "yellow") {
          navigate("/calm-medium");
        } else if (difficulty === "green") {
          navigate("/calm-easy");
        } else {
          alert(`Selected difficulty: ${difficulty}`);
        }
      } else {
        if (difficulty === "red") {
          navigate("/memory-card-game");
        } else if (difficulty === "yellow") {
          navigate("/medium");
        } else if (difficulty === "green") {
          navigate("/easy");
        } else {
          alert(`Please select a difficulty level`);
        }
      }
    }, 250);
  };

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${isCalmMode ? calmBackground : backgroundGif})`,
      }}
    >
      <h1 className={`game-title ${isCalmMode ? "calm-title" : ""}`}>
        WonderCards
      </h1>

      <div className="button-container">
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={PlayopenModal}
          onMouseEnter={playHoverSound}
        >
          Play
        </button>
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={() => {
            playClickSound();
            setTimeout(() => {
              navigate('/history');
            }, 300);
          }}
          onMouseEnter={playHoverSound}
        >
          My History
        </button>
        <button
          className={`game-button ${isCalmMode ? "calm-button" : ""}`}
          onClick={SettingopenModal}
          onMouseEnter={playHoverSound}
        >
          Settings
        </button>
      </div>
      <Modal
        isOpen={SettingsmodalIsOpen}
        onRequestClose={SettingcloseModal}
        style={{
          ...modalStyles,
          content: {
            ...modalStyles.content,
            backgroundColor: isCalmMode ? "#86a17d" : "#1e1e2e",
            color: isCalmMode ? "#ffffff" : "#fff",
          },
        }}
      >
        <button
          onClick={SettingcloseModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <X size={24} />
        </button>

        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Background Music
        </h2>
        <div className="volume-control">
          <span className="volume-icon">{mutedBg ? "🔇" : "🔊"}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={bgVolume}
            onChange={handleBgVolumeChange}
            className="volume-slider"
          />
        </div>

        <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
          Sound Effects
        </h2>
        <div className="volume-control">
          <span className="volume-icon">{mutedSfx ? "🔇" : "🔊"}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={handleSfxVolumeChange}
            className="volume-slider"
          />
        </div>

        {/* <div className="calm-mode">
          <h2 className={`${isCalmMode ? "calm-mode-label" : ""} modal-h2`}>
            Calm Mode
          </h2>
          <label className="switch">
            <input
              type="checkbox"
              checked={isCalmMode}
              onChange={toggleCalmMode}
            />
            <span className="slider round"></span>
          </label>
        </div> */}
      </Modal>

      <Dialog 
        open={PlaymodalIsOpen} 
        onClose={PlaycloseModal}
        fullWidth 
        maxWidth="md"
        TransitionComponent={Zoom}
        PaperProps={{
          style: {
            backgroundColor: 'rgba(44, 44, 84, 0.9)',
            border: '2px solid #00d9ff',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 24px rgba(0, 217, 255, 0.3)',
            margin: '16px',
            overflowY: 'auto',
            maxHeight: '90vh',
            width: '95%',
            maxWidth: '800px'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#fff', 
          textAlign: 'center',
          fontFamily: '"Press Start 2P", cursive',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          textShadow: '0 0 10px #00d9ff',
          pb: 2,
          pt: 4
        }}>
          Choose Your Challenge
          <IconButton
            aria-label="close"
            onClick={PlaycloseModal}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: '#00d9ff',
              '&:hover': {
                backgroundColor: 'rgba(0, 217, 255, 0.2)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ px: { xs: 3, sm: 5 }, pb: 5, pt: 3 }}>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Paper 
                elevation={6} 
                onClick={() => handleDifficultySelect("green")}
                sx={{
                  bgcolor: difficulty === "green" ? 'rgba(67, 160, 71, 0.8)' : 'rgba(67, 160, 71, 0.4)',
                  color: '#fff',
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  minHeight: { xs: '140px', sm: '180px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: difficulty === "green" ? '2px solid #7bff7b' : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  transform: difficulty === "green" ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    bgcolor: 'rgba(67, 160, 71, 0.6)',
                    transform: 'scale(1.02)'
                  }
                }}
                onMouseEnter={playHoverSound}
              >
                <SchoolIcon sx={{ fontSize: { xs: 40, sm: 50 }, mb: 3 }} />
                <Typography variant="h6" sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '0.7rem', sm: '0.8rem' }, textAlign: 'center' }}>
                  Easy
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontSize: '0.7rem', textAlign: 'center' }}>
                  Perfect for beginners
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Paper 
                elevation={6} 
                onClick={() => handleDifficultySelect("yellow")}
                sx={{
                  bgcolor: difficulty === "yellow" ? 'rgba(251, 192, 45, 0.8)' : 'rgba(251, 192, 45, 0.4)',
                  color: '#fff',
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  minHeight: { xs: '140px', sm: '180px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', 
                  border: difficulty === "yellow" ? '2px solid #ffeb3b' : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  transform: difficulty === "yellow" ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    bgcolor: 'rgba(251, 192, 45, 0.6)',
                    transform: 'scale(1.02)'
                  }
                }}
                onMouseEnter={playHoverSound}
              >
                <DirectionsRunIcon sx={{ fontSize: { xs: 40, sm: 50 }, mb: 3 }} />
                <Typography variant="h6" sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '0.7rem', sm: '0.8rem' }, textAlign: 'center' }}>
                  Medium
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontSize: '0.7rem', textAlign: 'center' }}>
                  Balanced challenge
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Paper 
                elevation={6} 
                onClick={() => handleDifficultySelect("red")}
                sx={{
                  bgcolor: difficulty === "red" ? 'rgba(211, 47, 47, 0.8)' : 'rgba(211, 47, 47, 0.4)',
                  color: '#fff',
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  minHeight: { xs: '140px', sm: '180px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: difficulty === "red" ? '2px solid #ff5252' : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  transform: difficulty === "red" ? 'scale(1.02)' : 'scale(1)',
                  '&:hover': {
                    bgcolor: 'rgba(211, 47, 47, 0.6)',
                    transform: 'scale(1.02)'
                  }
                }}
                onMouseEnter={playHoverSound}
              >
                <LocalFireDepartmentIcon sx={{ fontSize: { xs: 40, sm: 50 }, mb: 3 }} />
                <Typography variant="h6" sx={{ fontFamily: '"Press Start 2P", cursive', fontSize: { xs: '0.7rem', sm: '0.8rem' }, textAlign: 'center' }}>
                  Hard
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontSize: '0.7rem', textAlign: 'center' }}>
                  For memory masters
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 3, width: '100%' }}>
            <Button 
              onClick={handlePlay}
              disabled={!difficulty}
              variant="contained"
              sx={{
                bgcolor: '#2c2c54',
                color: '#fff',
                border: '2px solid #00d9ff',
                borderRadius: '8px',
                px: { xs: 4, sm: 6 },
                py: { xs: 1.5, sm: 2 },
                fontFamily: '"Press Start 2P", cursive',
                fontSize: { xs: '0.7rem', sm: '0.9rem' },
                textTransform: 'none',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: '#40407a',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
                },
                '&:disabled': {
                  bgcolor: 'rgba(44, 44, 84, 0.5)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(0, 217, 255, 0.3)'
                }
              }}
              onMouseEnter={playHoverSound}
            >
              Start Game
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Play;
