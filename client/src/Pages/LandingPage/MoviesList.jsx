import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  useTheme,
  alpha,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  useMediaQuery,
  Chip,
  Stack,
  Rating,
  Skeleton,
  Backdrop,
  Zoom,
  Fab,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  PlayArrow, 
  Close as CloseIcon,
  AccessTime,
  CalendarToday,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  KeyboardArrowUp
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SignInFooter from './SignIn-Footer';

// Sample movies data with actual images and trailer links
const movies = [
  {
    title: 'Interstellar',
    year: 2014,
    director: 'Christopher Nolan',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    image: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    rating: 4.8,
    duration: '2h 49m',
    genre: 'Sci-Fi',
    isFavorite: false
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    director: 'Christopher Nolan',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    trailer: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    rating: 4.9,
    duration: '2h 32m',
    genre: 'Action',
    isFavorite: true
  },
  {
    title: 'Inception',
    year: 2010,
    director: 'Christopher Nolan',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    trailer: 'https://www.youtube.com/embed/YoHD9XEInc0',
    rating: 4.7,
    duration: '2h 28m',
    genre: 'Sci-Fi',
    isFavorite: false
  },
  {
    title: 'The Prestige',
    year: 2006,
    director: 'Christopher Nolan',
    description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
    image: 'https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_.jpg',
    trailer: 'https://www.youtube.com/embed/ijXruSzfGEc',
    rating: 4.6,
    duration: '2h 10m',
    genre: 'Drama',
    isFavorite: false
  }
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MoviesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isHeroVideoLoaded, setIsHeroVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMovies, setLoadingMovies] = useState([]);

  // Simulate loading for better UX
  useEffect(() => {
    // Create skeleton loading states
    setLoadingMovies(Array(movies.length).fill(0));
    
    const timer = setInterval(() => {
      setLoadingProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 10, 100);
        if (newProgress === 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
        }
        return newProgress;
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Track scroll position for "scroll to top" button
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setShowScrollTop(position > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseMovie = () => {
    setSelectedMovie(null);
    setShowTrailer(false);
  };

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    setShowTrailer(true);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleFavorite = (e, movie) => {
    e.stopPropagation();
    // In a real app, you would update the state here
    console.log(`Toggled favorite for ${movie.title}`);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
        : `linear-gradient(180deg, ${alpha('#f5f5f5', 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
      position: 'relative',
    }}>
      {/* Loading overlay */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 4,
          backdropFilter: 'blur(8px)',
        }}
        open={isLoading}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold',
            mb: 4,
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontSize: { xs: '2rem', md: '3rem' },
            textAlign: 'center',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Movie Theater
        </Typography>
        
        <Box sx={{ width: '300px', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={loadingProgress} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              }
            }}
          />
        </Box>
        
        <Typography variant="body1" color="white" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          Loading movie experience...
        </Typography>
      </Backdrop>

      {/* Hero Section with Video Background */}
      <Box sx={{ 
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        mb: 8,
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0.8)} 0%, ${alpha(theme.palette.common.black, 0.3)} 50%, ${alpha(theme.palette.common.black, 0.8)} 100%)`,
            zIndex: 1,
            opacity: isHeroVideoLoaded ? 1 : 0,
            transition: 'opacity 1s ease'
          }}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsHeroVideoLoaded(true)}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: isHeroVideoLoaded ? 1 : 0,
            transition: 'opacity 1.5s ease'
          }}
        >
          <source 
            src="https://cdn.pixabay.com/video/2024/02/14/200566-913040174_large.mp4" 
            type="video/mp4" 
          />
        </video>
        <Container maxWidth="lg" sx={{ 
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 800,
                mb: 2,
                color: 'white',
                textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                letterSpacing: '-0.02em',
                marginBottom: 3
              }}
            >
              Movie Theater
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white',
                mb: 6,
                fontWeight: 400,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                fontSize: { xs: '1.2rem', md: '1.6rem' },
                maxWidth: '800px',
                marginX: 'auto',
                lineHeight: 1.5
              }}
            >
              Experience the magic of cinema with our curated selection of films
            </Typography>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Button
                variant="contained"
                size="large"
                href="#movies"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0px 6px 20px rgba(255, 105, 135, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0px 8px 25px rgba(255, 105, 135, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Explore Movies
              </Button>
            </motion.div>
          </motion.div>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <IconButton
                href="#movies"
                sx={{
                  color: 'white',
                  border: '2px solid white',
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <KeyboardArrowUp sx={{ transform: 'rotate(180deg)' }} />
              </IconButton>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Movies Grid */}
      <Container id="movies" maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              mb: { xs: 4, md: 6 },
              textAlign: 'center',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Now Showing
          </Typography>
        </motion.div>
        
        <Grid container spacing={4}>
          {(isLoading ? loadingMovies : movies).map((movie, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
                transition={{ duration: 0.6, delay: isLoading ? 0 : index * 0.15 }}
              >
                {isLoading ? (
                  // Skeleton loading state
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                  }}>
                    <Skeleton variant="rectangular" height={400} animation="wave" />
                    <CardContent>
                      <Skeleton variant="text" height={30} width="80%" animation="wave" />
                      <Skeleton variant="text" height={20} width="60%" animation="wave" />
                      <Skeleton variant="text" height={40} width="100%" animation="wave" />
                    </CardContent>
                  </Card>
                ) : (
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                        '& .MuiCardMedia-root': {
                          filter: 'brightness(1.1) contrast(1.1)',
                          transform: 'scale(1.05)',
                        },
                        '& .movie-poster-overlay': {
                          opacity: 1,
                        },
                        '& .movie-title': {
                          color: theme.palette.primary.main,
                        }
                      }
                    }}
                    onClick={() => handleMovieClick(movie)}
                  >
                    <Box sx={{ 
                      position: 'relative',
                      paddingTop: '150%', // 2:3 aspect ratio for movie posters
                      width: '100%',
                      overflow: 'hidden',
                    }}>
                      <CardMedia
                        component="img"
                        image={movie.image}
                        alt={movie.title}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'all 0.5s ease',
                        }}
                      />
                      <Box
                        className="movie-poster-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.9)} 0%, ${alpha(theme.palette.common.black, 0.3)} 50%, ${alpha(theme.palette.common.black, 0.4)} 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.5s ease',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrailer(e);
                          handleMovieClick(movie);
                        }}
                      >
                        <IconButton 
                          sx={{
                            bgcolor: alpha(theme.palette.common.white, 0.15),
                            color: 'white',
                            p: 2,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.8),
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <PlayArrow sx={{ fontSize: 40 }} />
                        </IconButton>
                      </Box>
                      
                      {/* Favorite button top right of card */}
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: alpha(theme.palette.background.paper, 0.6),
                          backdropFilter: 'blur(4px)',
                          color: movie.isFavorite ? theme.palette.error.main : 'white',
                          '&:hover': {
                            background: alpha(theme.palette.background.paper, 0.8),
                            transform: 'scale(1.1)',
                          },
                        }}
                        onClick={(e) => toggleFavorite(e, movie)}
                      >
                        {movie.isFavorite ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      
                      {/* Rating badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: alpha(theme.palette.background.paper, 0.7),
                          backdropFilter: 'blur(4px)',
                          px: 1,
                          py: 0.5,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                        <Typography variant="body2" fontWeight="bold">
                          {movie.rating}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent sx={{ 
                      flexGrow: 1, 
                      position: 'relative',
                      p: 3
                    }}>
                      <Typography 
                        className="movie-title"
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 1,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {movie.title}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} mb={2}>
                        <Chip 
                          label={movie.year} 
                          size="small" 
                          sx={{ 
                            background: alpha(theme.palette.primary.main, 0.1),
                            fontWeight: 500,
                            color: theme.palette.primary.main,
                          }}
                        />
                        <Chip 
                          label={movie.genre} 
                          size="small" 
                          sx={{ 
                            background: alpha(theme.palette.secondary.main, 0.1),
                            fontWeight: 500,
                            color: theme.palette.secondary.main,
                          }}
                        />
                      </Stack>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        color: theme.palette.text.secondary,
                        mb: 1,
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{movie.duration}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{movie.year}</Typography>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.5,
                          height: '3em',
                        }}
                      >
                        {movie.description}
                      </Typography>
                      
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderRadius: '8px',
                          mt: 'auto',
                          textTransform: 'none',
                          fontWeight: 600,
                          background: alpha(theme.palette.primary.main, 0.05),
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      >
                        Details
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Movie Details Dialog */}
      <Dialog
        open={!!selectedMovie}
        onClose={handleCloseMovie}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            overflow: 'hidden',
            borderRadius: '24px',
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        {selectedMovie && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 3,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {selectedMovie.title}
              </Typography>
              <IconButton 
                onClick={handleCloseMovie} 
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: alpha(theme.palette.common.white, 0.2),
                    transform: 'rotate(90deg)',
                  },
                  transition: 'transform 0.3s ease',
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: { xs: '300px', md: '500px' },
                  }}>
                    {showTrailer ? (
                      <Box
                        sx={{
                          position: 'relative',
                          height: '100%',
                          width: '100%',
                          overflow: 'hidden'
                        }}
                      >
                        <iframe
                          src={selectedMovie.trailer}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </Box>
                    ) : (
                      <>
                        <CardMedia
                          component="img"
                          image={selectedMovie.image}
                          alt={selectedMovie.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.9)',
                            transition: 'transform 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.03)',
                            }
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.common.black, 0.4),
                            backdropFilter: 'blur(2px)',
                            cursor: 'pointer',
                            '&:hover': {
                              background: alpha(theme.palette.common.black, 0.6),
                            },
                            transition: 'background 0.3s ease',
                          }}
                          onClick={() => setShowTrailer(true)}
                        >
                          <IconButton
                            sx={{
                              p: 2,
                              color: 'white',
                              background: alpha(theme.palette.primary.main, 0.8),
                              '&:hover': {
                                background: theme.palette.primary.main,
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <PlayArrow sx={{ fontSize: 40 }} />
                          </IconButton>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={3}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h5" fontWeight={700}>
                            {selectedMovie.title}
                          </Typography>
                          <IconButton
                            size="small"
                            color={selectedMovie.isFavorite ? "error" : "default"}
                            sx={{
                              border: `1px solid ${selectedMovie.isFavorite ? theme.palette.error.main : theme.palette.divider}`,
                              p: 0.5,
                            }}
                          >
                            {selectedMovie.isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                          </IconButton>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          Directed by {selectedMovie.director}
                        </Typography>
                      </Box>
                      
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={selectedMovie.year} 
                          sx={{ 
                            background: alpha(theme.palette.primary.main, 0.1),
                            fontWeight: 500,
                            color: theme.palette.primary.main,
                          }}
                        />
                        <Chip 
                          label={selectedMovie.duration} 
                          sx={{ 
                            background: alpha(theme.palette.secondary.main, 0.1),
                            fontWeight: 500,
                            color: theme.palette.secondary.main,
                          }}
                        />
                        <Chip 
                          label={selectedMovie.genre} 
                          sx={{ 
                            background: alpha(theme.palette.success.main, 0.1),
                            fontWeight: 500,
                            color: theme.palette.success.main,
                          }}
                        />
                      </Stack>
                      
                      <Box>
                        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                          {selectedMovie.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating
                            value={selectedMovie.rating}
                            precision={0.1}
                            readOnly
                            icon={<Star sx={{ color: '#FFD700' }} />}
                            emptyIcon={<StarBorder sx={{ color: alpha('#FFD700', 0.5) }} />}
                          />
                          <Typography variant="body1" fontWeight={500}>
                            {selectedMovie.rating}/5
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          py: 1.5,
                          mt: 'auto',
                          fontWeight: 600,
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontSize: '1rem',
                          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                          boxShadow: '0 6px 20px rgba(255, 105, 135, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255, 105, 135, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Not Available
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Scroll to top FAB */}
      <Zoom in={showScrollTop}>
        <Tooltip title="Scroll to top">
          <Fab 
            color="primary" 
            aria-label="scroll-to-top" 
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              boxShadow: '0 4px 20px rgba(255, 105, 135, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 25px rgba(255, 105, 135, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        </Tooltip>
      </Zoom>

      <SignInFooter />
    </Box>
  );
};

export default MoviesList;