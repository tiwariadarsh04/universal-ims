import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// sign In only by user
export const signInUser = async(userInfo) =>{

    try {
        const {data} = await client.post('/auth/signIn',userInfo,{
            credentials: 'included',
            method : 'POST',
            headers:{
              'content-type':'application/json'
            }
          });
        return data;
    } catch (error) {
        console.log(error)
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}


// sign In only by user and member 
export const signInUserAndMember = async(userInfo) =>{

    try {
        const {data} = await client.post('/auth/user-member-login',userInfo,{
            credentials: 'included',
            method : 'POST',
            headers:{
              'content-type':'application/json'
            }
          });
        return data;
    } catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

// sign out
export const signOutUser = async (jwtToken) => {

  if(!jwtToken) return console.log("No token provided")
  try {
    const { data } = await client.post('/auth/sign-out',{jwtToken},{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
      }
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};


// for checking role 
export const checkPermission = async(token) =>{
    if (!token) return { error: 'token is required' };

    try {
        const {data} = await client.get('/auth/permissions',{
            headers: {
                Authorization: 'Bearer ' + token,
                accept: 'application/json', 
            },
        });
        return data;
    } catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}


// OTP reset password
export const getOTPForResetPassword = async(email) =>{
  if (!email) return { error: 'email is required' };

  try {
      const {data} = await client.post('/auth/send-otp',{email},{
          headers: {
              accept: 'application/json', 
          },
      });
      return data;
  } catch (error) {
      const {response} = error;
      if(response?.data) return response.data;
      return {error: error.message || error};
  }
}

// verify OTP 
export const verifyOTP = async(email,OTP) =>{
  if (!email) return { error: 'email is required' };

  try {
      const {data} = await client.post('/auth/verify-otp',{email,OTP},{
          headers: {
              accept: 'application/json', 
          },
      });
      return data;
  } catch (error) {
      const {response} = error;
      if(response?.data) return response.data;
      return {error: error.message || error};
  }
}

// change password
export const chnagePassword = async(newPassword,email,tempToken) =>{
  if (!email) return { error: 'email is required' };

  try {
      const {data} = await client.post('/auth/chnage-password',{newPassword,email,tempToken},{
          headers: {
              accept: 'application/json', 
          },
      });
      return data;
  } catch (error) {
      const {response} = error;
      if(response?.data) return response.data;
      return {error: error.message || error};
  }
}

// app-user/get-user-byusername
export const getUserProfile = async(id) =>{
    if (!id) return { error: 'id is required' };

    try {
        const {data} = await client.post('/app-user/get-user-byId',{id},{
            method : 'POST',
            headers: {
                'content-type':'application/json'
            },
        });
        return data;
    } catch (error) {
        const {response} = error;
        console.log("error res",response);
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

// get user Role

export const getUserRole = async (username) => {
    if (!username) return { error: 'username is required' };
  
    try {
      const { data } = await client.post(
        '/app-user/check-user-role',{ username }, 
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
        }
      );
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) return response.data;
      return { error: error.message || error };
    }
  };

  export const getApplicationUserProfile = async (userId) => {
    if (!userId) return { error: 'username is required' };
  
    try {
      const { data } = await client.get(
        '/app-user/get-user-byId',{ userId }, 
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
        }
      );
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) return response.data;
      return { error: error.message || error };
    }
  };

  // create applicatio user
  export const createApplicationUser = async(userInfo) =>{

    try {
        const {data} = await client.post('/app-user/create',userInfo,{
            method : 'POST',
            headers: {
                'content-type':'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
        });
        return data;
    } catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

  // application-user
  export const getApplicationUsers = async() =>{

    try {
        const {data} = await client.get('/app-user/application-user',{
            method : 'GET',
            headers: {
                'content-type':'application/json',
                'Authorization': `Bearer ${user?.token}`
            },
        });
        return data;
    } catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

// delete application user
export const deleteApplicationUser = async(userInfo,targetUserId) =>{

  try {
      const {data} = await client.delete(`/app-user/${targetUserId}`,{
          data: {userInfo},
          method : 'DELETE',
          headers: {
              'content-type':'application/json',
              'Authorization': `Bearer ${user?.token}`
          },
      });
      return data;
  } catch (error) {
      const {response} = error;
      if(response?.data) return response.data;
      return {error: error.message || error};
  }
}


export const getIsAuth = async(token) =>{

  try {
      const {data} = await client.get('/auth/is-auth',{
          headers: {
              accept: 'application/json', 
              'Authorization': `Bearer ${user?.token}`
          },
      });
      return data;
  } catch (error) {
      const {response} = error;
      if(response?.data) return response.data;
      return {error: error.message || error};
  }
}