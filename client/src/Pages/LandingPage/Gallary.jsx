import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Pagination, 
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Chip
} from '@mui/material';
import { 
  Close as CloseIcon,
  LocationOn,
  CalendarToday,
  ZoomIn,
  NavigateNext,
  NavigateBefore
} from '@mui/icons-material';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Import gallery images
import Picture1 from '../../assets/gallery/Picture-1.jpg';
import Picture2 from '../../assets/gallery/Picture-2.jpg';
import Picture3 from '../../assets/gallery/Picture-3.jpg';
import Picture4 from '../../assets/gallery/Picture-4.jpg';
import Picture5 from '../../assets/gallery/Picture-5.jpg';
import Picture6 from '../../assets/gallery/Picture-6.jpg';
import Picture7 from '../../assets/gallery/Picture-7.jpg';
import Picture8 from '../../assets/gallery/Picture-8.jpg';

// Gallery data with actual images
const galleryImages = [
  {
    src: Picture1,
    title: 'Annual Gala Night',
    location: 'Club Main Hall',
    date: '2023-12-15',
    category: 'Events',
  },
  {
    src: Picture2,
    title: 'Sports Day',
    location: 'Club Grounds',
    date: '2023-12-20',
    category: 'Sports',
  },
  {
    src: Picture3,
    title: 'Diwali Celebration',
    location: 'Club Lawn',
    date: '2023-11-10',
    category: 'Festivals',
  },
  {
    src: Picture4,
    title: 'Summer Pool Party',
    location: 'Swimming Pool',
    date: '2023-06-25',
    category: 'Parties',
  },
  {
    src: Picture5,
    title: 'Festive Event',
    location: 'Club Hall',
    date: '2023-10-05',
    category: 'Events',
  },
  {
    src: Picture6,
    title: 'Private Party',
    location: 'Club Lounge',
    date: '2023-09-15',
    category: 'Parties',
  },
  {
    src: Picture7,
    title: 'Cultural Night',
    location: 'Club Auditorium',
    date: '2023-08-20',
    category: 'Events',
  },
  {
    src: Picture8,
    title: 'New Year Celebration',
    location: 'Club Main Hall',
    date: '2023-12-31',
    category: 'Parties',
  },
];

// Masonry breakpoints
const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GallerySection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(galleryImages.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    setSelectedImage(galleryImages[(currentIndex + 1) % galleryImages.length]);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
    setSelectedImage(galleryImages[(currentIndex - 1 + galleryImages.length) % galleryImages.length]);
  };

  const currentItems = galleryImages.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box 
      id="gallery"
      sx={{ 
        my: 6, 
        py: 6,
        // background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
        }
      }}
    >
      <Container>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1em'
          }}
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover .gallery-overlay': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                  '&:hover .gallery-image': {
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => handleImageClick(item, (page - 1) * itemsPerPage + index)}
              >
                <motion.img
                  className="gallery-image"
                  src={item.src}
                  alt={item.title}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <Box
                  className="gallery-overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.8)} 0%, transparent 100%)`,
                    color: 'white',
                    p: 3,
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      mb: 1,
                      background: alpha(theme.palette.primary.main, 0.8),
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {item.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      {format(new Date(item.date), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: alpha(theme.palette.common.white, 0.2),
                      color: 'white',
                      '&:hover': {
                        background: alpha(theme.palette.common.white, 0.3),
                      }
                    }}
                  >
                    <ZoomIn />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Masonry>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                '&.Mui-selected': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  color: 'white',
                }
              }
            }}
          />
        </Box>

        <Dialog
          open={!!selectedImage}
          onClose={handleClose}
          TransitionComponent={Transition}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pb: 1
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedImage?.title}
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: 'text.primary' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ position: 'relative' }}>
              <img
                src={selectedImage?.src}
                alt={selectedImage?.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                }}
              />
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: alpha(theme.palette.common.white, 0.8),
                  '&:hover': {
                    background: alpha(theme.palette.common.white, 0.9),
                  }
                }}
              >
                <NavigateBefore />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: alpha(theme.palette.common.white, 0.8),
                  '&:hover': {
                    background: alpha(theme.palette.common.white, 0.9),
                  }
                }}
              >
                <NavigateNext />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Chip
                label={selectedImage?.category}
                size="small"
                sx={{
                  mb: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  color: 'white',
                  fontWeight: 500,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body1">
                  {selectedImage?.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body1">
                  {selectedImage?.date ? format(new Date(selectedImage.date), 'MMMM d, yyyy') : ''}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default GallerySection;