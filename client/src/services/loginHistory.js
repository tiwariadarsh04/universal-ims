import client from "./clinet";
const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// fetch all login history
export const getAllLoginHistory = async() =>{

    try {
        const {data} = await client.get('/login-history/all',{},{
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

// fetch login history by user id
export const getLoginHistoryByUserId = async() => {
    try {
        const {data} = await client.get(`/login-history/user/${user.id}`,{},{
                headers: { 
                    'content-type':'application/json',
                 },
              });
        return data;
    } catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}