import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

export const getDevOptions = async(userId) =>{

    try {
        const {data} = await client.get(`/dev-option/${userId}`,{
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

export const updateDevOptions = async(userId,updateData) =>{

    try {
        const {data} = await client.put(`/dev-option/${userId}`,{updateData},{
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