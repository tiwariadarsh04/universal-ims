import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// create a new event
export const createNewEvent = async(eventInfo) =>{

    try {
        const {data} = await client.post('/event-management/create',eventInfo,{
                headers: { 
                    'Content-Type': 'multipart/form-data',
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


// get event list

export const getEventList = async() =>{

    try {
        const {data} = await client.get('/event-management/fetch-events',{
            method : 'GET',
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

// /delete-event
export const deleteEvent = async(eventID) =>{

    try {
        const {data} = await client.delete(`/event-management/${eventID}/delete-event`,{
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

// /:eventID/update-event

export const updateEvent = async(eventID) =>{

    try {
        const {data} = await client.put(`/event-management/${eventID}/update-event`,{
            method : 'PUT',
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