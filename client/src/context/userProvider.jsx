import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMemberProfile } from '../services/Member';


export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Function to fetch user data
  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await getMemberProfile(userId);
      console.log(response)

      if (response && response._id) {
        setUserProfile(response);
        localStorage.setItem('userProfile', JSON.stringify(response));
      } else {
        throw new Error('Invalid user profile response');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUserProfile(null);
      localStorage.removeItem('userProfile'); 
      navigate('/auth/sign-in', { replace: true }); 
    } finally {
      setLoading(false);
    }
  };

  // Fetch the user automatically when the provider mounts
  useEffect(() => {
    const getLocalUserProfile = () => {
      try {
        const localData = localStorage.getItem('user');
        if (!localData) {
          navigate('/auth/sign-in', { replace: true });
          return null;
        }
        return JSON.parse(localData);
      } catch (error) {
        console.error('Error parsing local user profile:', error);
        localStorage.removeItem('userProfile'); // Clear corrupted data
        navigate('/auth/sign-in', { replace: true });
        return null;
      }
    };

    const localUserProfile = getLocalUserProfile();
    if (localUserProfile && localUserProfile.id && localUserProfile.roles === 'user') {
      fetchUserProfile(localUserProfile.id);
    }
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, loading, fetchUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProfileProvider');
  }
  return context;
};