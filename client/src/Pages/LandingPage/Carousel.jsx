import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import POSTER1 from '../../assets/poster1.jpeg';
import POSTER2 from '../../assets/poster2.jpeg';
import POSTER3 from '../../assets/poster3.jpeg';

// Carousel settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  fade: true,
  arrows: false,
  dotsClass: 'slick-dots custom-dots',
  appendDots: dots => (
    <Box
      sx={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        '& .custom-dots': {
          display: 'flex',
          gap: '8px',
          '& li': {
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            transition: 'all 0.3s ease',
            '&.slick-active': {
              background: '#FF0099',
              transform: 'scale(1.2)'
            }
          }
        }
      }}
    >
      {dots}
    </Box>
  )
};

const Carousel = () => {
  const slides = [
    {
      image: POSTER1,
      title: "Welcome ",
      subtitle: "Experience luxury and comfort like never before",
      buttonText: "Explore More"
    },
    {
      image: POSTER2,
      title: "World-Class Amenities",
      subtitle: "Discover our premium facilities and services",
      buttonText: "View Facilities"
    },
    {
      image: POSTER3,
      title: "Exclusive Events",
      subtitle: "Join us for unforgettable experiences",
      buttonText: "See Events"
    }
  ];

  return (
    <Box sx={{ 
      position: 'relative', 
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <Slider {...carouselSettings}>
        {slides.map((slide, index) => (
          <Box key={index} sx={{ position: 'relative', height: '100vh' }}>
            <Box
              component="img"
              src={slide.image}
              alt={`Slide ${index + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.7)'
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
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white',
                p: 4,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)'
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)',
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.3)'
                      }
                    }}
                  >
                    {slide.buttonText}
                  </Button>
                </motion.div>
              </motion.div>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Carousel;