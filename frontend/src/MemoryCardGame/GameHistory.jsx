import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Container,
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  IconButton,
  GlobalStyles,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import background from '../assets/images/mode1.gif';

// Add a fade-in animation at the top
const fadeIn = `
  @keyframes fadeIn {
    from { 
      opacity: 0.7; 
      background-color: rgba(0, 31, 63, 0.3);
    }
    to { 
      opacity: 1;
      background-color: transparent;
    }
  }
  
  @keyframes pulse {
    0% { opacity: 0.7; transform: scale(0.98); }
    50% { opacity: 1; transform: scale(1); }
    100% { opacity: 0.7; transform: scale(0.98); }
  }
  
  @keyframes bounce {
    from { transform: scale(0.8); }
    to { transform: scale(1.1); }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

// Add the animation to GlobalStyles
const globalStyles = (
  <GlobalStyles
    styles={{
      '@media (min-width: 1200px)': {
        '.MuiContainer-root': {
          maxWidth: '1600px !important',
        },
      },
      '@keyframes fadeIn': {
        from: { 
          opacity: 0.7,
          backgroundColor: 'rgba(0, 31, 63, 0.3)'
        },
        to: { 
          opacity: 1,
          backgroundColor: 'transparent'
        },
      },
      '@keyframes pulse': {
        '0%': { opacity: 0.7, transform: 'scale(0.98)' },
        '50%': { opacity: 1, transform: 'scale(1)' },
        '100%': { opacity: 0.7, transform: 'scale(0.98)' }
      },
      '@keyframes bounce': {
        from: { transform: 'scale(0.8)' },
        to: { transform: 'scale(1.1)' }
      },
      '@keyframes float': {
        '0%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' },
        '100%': { transform: 'translateY(0px)' }
      }
    }}
  />
);

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: '10px',
  margin: 0,
  maxWidth: '1600px',
  overflowX: 'hidden',
  overflowY: 'hidden',
  animation: 'fadeIn 0.4s ease',
  '@media (max-width: 600px)': {
    padding: '5px',
  }
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  paddingTop: '10px',
  '@media (max-width: 600px)': {
    marginBottom: '10px',
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontFamily: '"Press Start 2P", cursive',
  textShadow: '0 0 10px #00d9ff',
  fontSize: '1.8rem',
  '@media (max-width: 600px)': {
    fontSize: '1.2rem',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '0.8rem',
  padding: '12px 24px',
  backgroundColor: '#2c2c54',
  color: '#fff',
  border: '2px solid #00d9ff',
  borderRadius: '8px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#40407a',
    boxShadow: '0 0 15px rgba(0, 217, 255, 0.5)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(44, 44, 84, 0.9)',
  border: '2px solid #00d9ff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(8px)',
  maxHeight: 'calc(100vh - 230px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '@media (max-width: 600px)': {
    padding: '15px 10px',
    maxHeight: 'calc(100vh - 200px)',
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(44, 44, 84, 0.85)',
  border: '2px solid #00d9ff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  height: '100%',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '0.7rem',
  padding: '10px 8px',
  borderBottom: '1px solid rgba(0, 217, 255, 0.3)',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '0.6rem',
    padding: '8px 4px',
  },
}));

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: 'rgba(0, 31, 63, 0.9)',
  fontWeight: 'bold',
  fontSize: '0.7rem',
  position: 'sticky',
  top: 0,
  zIndex: 11,
  borderBottom: '2px solid rgba(0, 217, 255, 0.8)',
  textAlign: 'center',
  padding: '12px 8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  color: '#00d9ff',
  '@media (max-width: 600px)': {
    fontSize: '0.6rem',
    padding: '10px 4px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  '&:hover': { 
    backgroundColor: 'rgba(0, 217, 255, 0.1)' 
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
}));

// Badge for difficulty
const DifficultyBadge = styled(Box)(({ difficulty }) => {
  let color = '#4caf50'; // Default green for Easy
  
  if (difficulty === 'Medium' || difficulty === 'Normal') {
    color = '#fbc02d'; // Yellow color to match the game's medium difficulty
  } else if (difficulty === 'Hard') {
    color = '#f44336';
  }
  
  return {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: color,
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    '@media (max-width: 600px)': {
      fontSize: '0.55rem',
      padding: '3px 6px',
    },
  };
});

// Badge for completion status
const CompletionBadge = styled(Box)(({ completed }) => ({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  backgroundColor: completed ? '#4caf50' : '#f44336',
  color: '#fff',
  fontSize: '0.65rem',
  fontWeight: 'bold',
  '@media (max-width: 600px)': {
    fontSize: '0.55rem',
    padding: '3px 6px',
  },
}));

const GameHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    successRate: 0,
    byDifficulty: {}
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userID = localStorage.getItem('userID');
        if (!userID) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5001/api/memory/history/${userID}`);
        setHistory(response.data.history);
        setStats(response.data.stats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game history:', err);
        setError('Failed to load game history. Please try again later.');
        setLoading(false);
      }
    };

    // Reset any opacity issues
    document.body.style.opacity = '1';
    document.body.style.animation = '';

    fetchHistory();

    return () => {
      // Reset opacity when component unmounts
      document.body.style.opacity = '1';
      document.body.style.animation = '';
    };
  }, []);

  const handleBack = () => {
    navigate('/play');
  };

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <StyledContainer>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            animation: 'fadeIn 0.4s ease-in'
          }}
        >
          <Typography 
            sx={{ 
              fontFamily: '"Press Start 2P", cursive',
              color: '#00d9ff',
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              textShadow: '0 0 10px rgba(0, 217, 255, 0.7)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}
          >
            Loading History...
          </Typography>
          
          <Box sx={{ position: 'relative', mb: 3 }}>
            <CircularProgress 
              size={80} 
              thickness={4}
              sx={{ 
                color: '#00d9ff',
                boxShadow: '0 0 15px rgba(0, 217, 255, 0.5)'
              }} 
            />
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SportsEsportsIcon 
                sx={{ 
                  fontSize: 40, 
                  color: '#fff',
                  animation: 'bounce 1s infinite alternate'
                }} 
              />
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 2
          }}>
            {['🔵', '🟡', '🔴'].map((emoji, index) => (
              <Typography 
                key={index}
                sx={{ 
                  fontSize: '24px',
                  animation: `float 1.5s infinite ease-in-out ${index * 0.2}s`
                }}
              >
                {emoji}
              </Typography>
            ))}
          </Box>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <>
      {globalStyles}
      <StyledContainer 
        maxWidth={false}
        sx={{ 
          maxWidth: '1600px !important',
          mx: 'auto'
        }}
      >
        <Fade in={true} timeout={600}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <StyledHeader>
              <Box display="flex" alignItems="center">
                <IconButton 
                  onClick={handleBack}
                  sx={{ 
                    color: '#00d9ff', 
                    mr: 2,
                    border: '2px solid #00d9ff',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 217, 255, 0.2)',
                    }
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <StyledTitle variant="h4">Game History</StyledTitle>
              </Box>
            </StyledHeader>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(244, 67, 54, 0.9)',
                  color: '#fff',
                  border: '1px solid #f44336',
                  '& .MuiAlert-icon': { color: '#fff' }
                }}
              >
                {error}
              </Alert>
            )}

            {!error && history.length === 0 && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                mt: 8 
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#fff', 
                    textAlign: 'center',
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '1rem',
                    mb: 3
                  }}
                >
                  No games played yet!
                </Typography>
                <Button 
                  variant="contained"
                  startIcon={<SportsEsportsIcon />}
                  onClick={handleBack}
                  sx={{ 
                    bgcolor: '#2c2c54',
                    color: '#fff',
                    fontFamily: '"Press Start 2P", cursive',
                    fontSize: '0.8rem',
                    border: '2px solid #00d9ff',
                    '&:hover': {
                      bgcolor: '#40407a',
                    }
                  }}
                >
                  Play Now
                </Button>
              </Box>
            )}

            {history.length > 0 && (
              <>
                <Zoom in={true} style={{ transitionDelay: '150ms' }}>
                  <div>
                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={4}>
                        <StyledCard>
                          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                            <EmojiEventsIcon sx={{ fontSize: 48, color: '#00d9ff', mb: 1 }} />
                            <Typography color="white" variant="h6" sx={{ 
                              fontFamily: '"Press Start 2P", cursive', 
                              fontSize: { xs: '0.8rem', sm: '1rem' }, 
                              mb: 1,
                              textAlign: 'center'
                            }}>
                              Games Played
                            </Typography>
                            <Typography color="white" variant="h4" sx={{ 
                              fontFamily: '"Press Start 2P", cursive', 
                              fontSize: { xs: '1.4rem', sm: '1.8rem' },
                              textAlign: 'center'
                            }}>
                              {stats.totalGames}
                            </Typography>
                          </CardContent>
                        </StyledCard>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <StyledCard>
                          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                            <TrendingUpIcon sx={{ fontSize: 48, color: '#00d9ff', mb: 1 }} />
                            <Typography color="white" variant="h6" sx={{ 
                              fontFamily: '"Press Start 2P", cursive', 
                              fontSize: { xs: '0.8rem', sm: '1rem' }, 
                              mb: 1,
                              textAlign: 'center'
                            }}>
                              Success Rate
                            </Typography>
                            <Typography color="white" variant="h4" sx={{ 
                              fontFamily: '"Press Start 2P", cursive', 
                              fontSize: { xs: '1.4rem', sm: '1.8rem' },
                              textAlign: 'center'
                            }}>
                              {stats.successRate}%
                            </Typography>
                          </CardContent>
                        </StyledCard>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <StyledCard>
                          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
                            <AccessTimeIcon sx={{ fontSize: 48, color: '#00d9ff', mb: 1 }} />
                            <Typography color="white" variant="h6" sx={{ 
                              fontFamily: '"Press Start 2P", cursive', 
                              fontSize: { xs: '0.8rem', sm: '1rem' }, 
                              mb: 1,
                              textAlign: 'center'
                            }}>
                              Completed
                            </Typography>
                            <Typography color="white" variant="h4" sx={{ 
                              fontFamily: '"Press Start 2P", cursive', 
                              fontSize: { xs: '1.4rem', sm: '1.8rem' },
                              textAlign: 'center'
                            }}>
                              {stats.completedGames}
                            </Typography>
                          </CardContent>
                        </StyledCard>
                      </Grid>
                    </Grid>
                  </div>
                </Zoom>

                <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                  <div>
                    {/* Games Table */}
                    <StyledPaper>
                      <Typography 
                        variant="h6" 
                        color="white" 
                        sx={{ 
                          fontFamily: '"Press Start 2P", cursive', 
                          fontSize: '1rem', 
                          mb: 2,
                          textAlign: 'center'
                        }}
                      >
                        Recent Games
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: {
                          xs: 'calc(100vh - 350px)',
                          sm: 'calc(100vh - 380px)',
                          md: 'calc(100vh - 400px)'
                        },
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        {/* Fixed header section */}
                        <Table 
                          size="small"
                          sx={{
                            tableLayout: 'fixed',
                            margin: 0,
                            border: 'none',
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            '& th:first-of-type': { 
                              width: { xs: '25%', sm: '25%' }
                            },
                            '& th:nth-of-type(2)': { 
                              width: { xs: '20%', sm: '15%' }
                            },
                            '& th:nth-of-type(3)': { 
                              width: { xs: '15%', sm: '15%' }
                            },
                            '& th:nth-of-type(4)': { 
                              width: { xs: '15%', sm: '20%' }
                            },
                            '& th:nth-of-type(5)': { 
                              width: { xs: '25%', sm: '25%' }
                            }
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              <StyledTableHeadCell>Date</StyledTableHeadCell>
                              <StyledTableHeadCell>Difficulty</StyledTableHeadCell>
                              <StyledTableHeadCell>Time</StyledTableHeadCell>
                              <StyledTableHeadCell>Failed Attempts</StyledTableHeadCell>
                              <StyledTableHeadCell>Status</StyledTableHeadCell>
                            </TableRow>
                          </TableHead>
                        </Table>
                        
                        {/* Scrollable content section */}
                        <TableContainer 
                          component={Paper} 
                          sx={{ 
                            bgcolor: 'transparent', 
                            boxShadow: 'none',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            overflowX: 'auto',
                            overflowY: 'auto',
                            flex: 1,
                            '&::-webkit-scrollbar': {
                              width: '8px',
                              height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                              background: 'rgba(0,0,0,0.1)',
                              borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: 'rgba(0, 217, 255, 0.5)',
                              borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                              background: 'rgba(0, 217, 255, 0.7)',
                            },
                            '@media (max-width: 600px)': {
                              '&::-webkit-scrollbar': {
                                width: '6px',
                                height: '6px',
                              }
                            }
                          }}
                        >
                          <Table 
                            size="small"
                            sx={{
                              tableLayout: 'fixed',
                              margin: 0,
                              border: 'none',
                              '& td:first-of-type': { 
                                width: { xs: '25%', sm: '25%' }
                              },
                              '& td:nth-of-type(2)': { 
                                width: { xs: '20%', sm: '15%' }
                              },
                              '& td:nth-of-type(3)': { 
                                width: { xs: '15%', sm: '15%' }
                              },
                              '& td:nth-of-type(4)': { 
                                width: { xs: '15%', sm: '20%' }
                              },
                              '& td:nth-of-type(5)': { 
                                width: { xs: '25%', sm: '25%' }
                              }
                            }}
                          >
                            <TableBody>
                              {history.map((game) => (
                                <StyledTableRow key={game.id}>
                                  <StyledTableCell>{formatDate(game.date)}</StyledTableCell>
                                  <StyledTableCell>
                                    <DifficultyBadge difficulty={game.difficulty}>
                                      {game.difficulty === 'Normal' ? 'Medium' : game.difficulty}
                                    </DifficultyBadge>
                                  </StyledTableCell>
                                  <StyledTableCell>{game.formattedTime}</StyledTableCell>
                                  <StyledTableCell>{game.failed}</StyledTableCell>
                                  <StyledTableCell>
                                    <CompletionBadge completed={game.success}>
                                      {game.success ? 'Completed' : 'Abandoned'}
                                    </CompletionBadge>
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </StyledPaper>
                  </div>
                </Zoom>
              </>
            )}
          </Box>
        </Fade>
      </StyledContainer>
    </>
  );
};

export default GameHistory; 