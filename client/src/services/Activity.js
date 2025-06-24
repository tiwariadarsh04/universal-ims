import client from "./clinet";
const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// create a new member
export const activityLogDetails = async() =>{

    try {
        const {data} = await client.get('/activity-log/',{},{
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

// delete all transactions

export const clearAllActivity = async(userInfo) =>{

    try {
        const {data} = await client.delete('/activity-log/',{
                data: { userInfo },
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


export const getLatestActivityLog = async() =>{

    try {
        const {data} = await client.get('/activity-log/latest?limit=2',{},{
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