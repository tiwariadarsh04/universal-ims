import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CardMedia,
  Box
} from '@mui/material';
import { MoreVert as MoreVertIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getEventList } from '../../services/Event';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const getEventAllList = async () =>{
    const res = await getEventList();

    if(res.error) return console.log(res.error);
    setEvents(res)
  }

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleDelete = async () => {
    console.log("delete")
  };

  const handleNotifyMembers = async (eventId) => {
    alert('not working')
  };

  useEffect(() => {
    getEventAllList();
     
  }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Events List
      </Typography>
      
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={ event.EventPoster ? `https://noaims.onrender.com/${event.EventPoster}` : 'https://placehold.co/400x200'}
                alt={event.EventName}
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {event.EventName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(event.EventDate).toLocaleDateString()} • {event.EventTime}
                </Typography>
                <Typography variant="body2" component="p">
                  {event.EventDescription}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<NotificationsIcon />}
                    onClick={() => handleNotifyMembers(event._id)}
                  >
                    Notify Members
                  </Button>
                  <IconButton
                    aria-label="more"
                    aria-controls="event-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, event._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Three-Dot Menu */}
      <Menu
        id="event-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          component={Link}
          to={`/events/${selectedEventId}`}
          onClick={handleMenuClose}
        >
          View Details
        </MenuItem>
        <MenuItem
          component={Link}
          to={`/events/${selectedEventId}/edit`}
          onClick={handleMenuClose}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Container>
  );
};

export default EventList;