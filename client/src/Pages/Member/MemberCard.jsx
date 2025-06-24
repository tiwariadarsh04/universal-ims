import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  ListItemIcon,
  Collapse,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Chip,
  Box,
  useTheme,
  alpha
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { editMemberProfile, addFamilyMember, changeMemberStatus } from "../../services/Member";

const MemberCard = ({ user, onEdit }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openFamily, setOpenFamily] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState(null);
  const [newFamilyMember, setNewFamilyMember] = useState({
    Name: "",
    Relation: "",
  });
  const open = Boolean(anchorEl);

  // Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Edit handlers
  const handleEditClick = () => {
    setEditedUser({ ...user });
    setEditMode(true);
    handleMenuClose();
  };

  const handleSave = async () => {
    try {
      // Prepare updates (exclude protected fields)
      const { _id, MemberID, Transaction, MemberSince, Role, session_id, Password, ...updates } = editedUser;
      
      const response = await editMemberProfile(user.MemberID, updates);
      onEdit(response.member);
      setEditMode(false);
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to update profile', { variant: 'error' });
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({ ...user });
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  // Family member handlers
  const handleFamilyToggle = () => setOpenFamily(!openFamily);

  const handleFamilyMemberChange = (field, value) => {
    if (editingFamilyMember !== null) {
      setNewFamilyMember(prev => ({ ...prev, [field]: value }));
    } else {
      setNewFamilyMember(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFamilyMemberSave = async () => {
    try {
      if (editingFamilyMember !== null) {
        // Edit existing member
        const updatedFamily = [...editedUser.FamilyMember];
        updatedFamily[editingFamilyMember] = newFamilyMember;
        const response = await editMemberProfile(user.MemberID, { FamilyMember: updatedFamily });
        onEdit(response.member);
      } else {
        // Add new member
        const response = await addFamilyMember(user.MemberID, newFamilyMember);
        onEdit(response.member);
      }
      
      setFamilyModalOpen(false);
      setEditingFamilyMember(null);
      setNewFamilyMember({ Name: "", Relation: "" });
      enqueueSnackbar('Family member saved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to save family member', { variant: 'error' });
    }
  };

  const handleEditFamilyMember = (index) => {
    setEditingFamilyMember(index);
    setNewFamilyMember(editedUser.FamilyMember[index]);
    setFamilyModalOpen(true);
  };

  const handleAddFamilyMember = () => {
    setEditingFamilyMember(null);
    setNewFamilyMember({ Name: "", Relation: "" });
    setFamilyModalOpen(true);
  };

  const handleDeleteFamilyMember = async (index) => {
    try {
      const updatedFamily = editedUser.FamilyMember.filter((_, i) => i !== index);
      const response = await editMemberProfile(user.MemberID, { FamilyMember: updatedFamily });
      onEdit(response.member);
      enqueueSnackbar('Family member removed', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to remove family member', { variant: 'error' });
    }
  };

  // Status handlers
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await changeMemberStatus(user.MemberID, newStatus);
      onEdit(response.member);
      enqueueSnackbar(`Member status changed to ${newStatus}`, { variant: 'success' });
      handleMenuClose();
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to change status', { variant: 'error' });
    }
  };

  // Navigation
  const handleTransactionClick = () => {
    navigate(`/user-transactions/${user._id}`);
    handleMenuClose();
  };

  // Menu items
  const menuItems = [
    { 
      label: 'Edit Profile', 
      icon: <EditIcon fontSize="small" />,
      onClick: handleEditClick
    },
    { 
      label: 'Transactions', 
      icon: <ReceiptIcon fontSize="small" />,
      onClick: handleTransactionClick
    },
    user.MembershipStatus === 'active' ? 
      { 
        label: 'Deactivate Member', 
        icon: <DeleteIcon fontSize="small" />,
        onClick: () => handleStatusChange('inactive')
      } : 
      { 
        label: 'Activate Member', 
        icon: <AddIcon fontSize="small" />,
        onClick: () => handleStatusChange('active')
      }
  ];

  return (
    <Card sx={{
      width: 400,
      margin: "1em",
      mt: 4,
      boxShadow: 3,
      borderRadius: 2,
      background: theme.palette.mode === 'dark' 
        ? alpha(theme.palette.background.paper, 0.9)
        : theme.palette.background.paper,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: 6,
      },
    }}>
      {/* Status Indicator Strip */}
      <Box sx={{
        height: "10px",
        background: user.MembershipStatus === 'active' 
          ? "linear-gradient(90deg, #4CAF50, #2E7D32)" 
          : "linear-gradient(90deg, #F44336, #C62828)",
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
      }}/>

      <CardContent sx={{ pb: 0, position: "relative" }}>
        {/* Three-Dot Menu Button */}
        <IconButton
          sx={{ 
            position: "absolute", 
            top: 8, 
            right: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 0
            }
          }}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>

        {/* Member Name and Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold", flexGrow: 1, color: theme.palette.text.primary }}>
            {editMode ? (
              <TextField
                value={editedUser.Name}
                onChange={(e) => handleInputChange("Name", e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 1,
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.default, 0.6)
                      : alpha(theme.palette.background.paper, 0.8),
                  }
                }}
              />
            ) : user.Name}
          </Typography>
          <Chip 
            label={user.MembershipStatus} 
            color={user.MembershipStatus === 'active' ? 'success' : 'error'} 
            size="small"
            sx={{mr:4, mb:2, borderRadius: 1}}
          />
        </Box>

        {/* Member Role */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <BadgeIcon sx={{ verticalAlign: "middle", mr: 1, color: "secondary.main" }} />
          Role: {user.Role}
        </Typography>
      </CardContent>

      {/* Member Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 1,
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.9)
              : theme.palette.background.paper,
            boxShadow: theme.shadows[4],
          }
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      <Divider sx={{ my: 2 }} />

      {/* Member Details */}
      <CardContent>
        {[
          { icon: <FingerprintIcon sx={{ mr: 1 }} />, label: "Member ID", field: "MemberID" },
          { icon: <ContactPhoneIcon sx={{ mr: 1 }} />, label: "P.No.", field: "Pno" },
          { icon: <PhoneIcon sx={{ mr: 1 }} />, label: "Contact", field: "Contact" },
          { icon: <EmailIcon sx={{ mr: 1 }} />, label: "Email", field: "Email" },
          { icon: <CalendarTodayIcon sx={{ mr: 1 }} />, label: "Member Since", field: "MemberSince" },
        ].map((item, index) => (
          <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            {item.icon} 
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="caption" color="text.secondary">
              {item.label}
              </Typography>
              {editMode && item.field !== "MemberSince" && item.field !== "MemberID" ? (
                <TextField
                  value={editedUser[item.field]}
                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ mt: 0.5 }}
                  InputProps={{
                    sx: {
                      borderRadius: 1,
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                    }
                  }}
                />
              ) : (
                <Typography variant="body1" color="text.primary">
                  {item.field === "MemberSince" 
                    ? new Date(user[item.field]).toLocaleDateString() 
                    : user[item.field]}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </CardContent>

      {/* Edit Mode Actions */}
      {editMode && (
        <CardContent sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancelEdit} 
            sx={{ 
              borderRadius: 1,
              boxShadow: 'none', 
              '&:hover': {
                boxShadow: theme.shadows[1]
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave} 
            sx={{ 
              borderRadius: 1,
              boxShadow: theme.shadows[1],
              '&:hover': {
                boxShadow: theme.shadows[2]
              }
            }}
          >
            Save Changes
          </Button>
        </CardContent>
      )}

      {/* Family Members Section */}
      <CardContent>
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: "bold", 
            mb: 2, 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center",
            justifyContent: 'space-between',
            color: theme.palette.text.primary
          }}
          onClick={handleFamilyToggle}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon sx={{ mr: 1, color: "primary.main" }} />
            Family Members ({user.FamilyMember?.length || 0})
          </Box>
          {openFamily ? <ExpandLess /> : <ExpandMore />}
        </Typography>
        
        <Collapse in={openFamily} timeout="auto" unmountOnExit>
          {user.FamilyMember?.length > 0 ? (
            <List component="div" disablePadding>
              {user.FamilyMember.map((member, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ pl: 4, py: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {member.Name.charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={member.Name}
                      secondary={`Relation: ${member.Relation}`}
                    />
                    {editMode && (
                      <>
                        <IconButton 
                          onClick={() => handleEditFamilyMember(index)}
                          sx={{ 
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: 0
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteFamilyMember(index)}
                          sx={{ 
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: 0
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </ListItem>
                  {index < user.FamilyMember.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No family members added
            </Typography>
          )}
          
          {editMode && (
            <Fab
              color="primary"
              aria-label="add family member"
              onClick={handleAddFamilyMember}
              sx={{ 
                mt: 2, 
                position: "relative", 
                left: "50%", 
                transform: "translateX(-50%)", 
                borderRadius: '50%',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[3]
                }
              }}
              size="small"
            >
              <AddIcon />
            </Fab>
          )}
        </Collapse>
      </CardContent>

      {/* Family Member Dialog */}
      <Dialog 
        open={familyModalOpen} 
        onClose={() => setFamilyModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.9)
              : theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          {editingFamilyMember !== null ? "Edit Family Member" : "Add Family Member"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            value={newFamilyMember.Name}
            onChange={(e) => handleFamilyMemberChange("Name", e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              sx: {
                borderRadius: 1,
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.default, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
              }
            }}
          />
          <TextField
            label="Relation"
            value={newFamilyMember.Relation}
            onChange={(e) => handleFamilyMemberChange("Relation", e.target.value)}
            fullWidth
            margin="normal"
            select
            SelectProps={{ 
              native: true,
              sx: {
                borderRadius: 1,
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.default, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
              }
            }}
            required
          >
            <option value=""></option>
            <option value="son">Son</option>
            <option value="daughter">Daughter</option>
            <option value="wife">Wife</option>
            <option value="husband">Husband</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setFamilyModalOpen(false)} 
            sx={{ 
              borderRadius: 1,
              boxShadow: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFamilyMemberSave} 
            color="primary"
            disabled={!newFamilyMember.Name || !newFamilyMember.Relation}
            variant="contained"
            sx={{ 
              borderRadius: 1,
              boxShadow: theme.shadows[1],
              '&:hover': {
                boxShadow: theme.shadows[2]
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MemberCard;