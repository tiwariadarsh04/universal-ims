// agenda-calender

import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

export const getAgendaList = async() =>{

    try {
        const {data} = await client.get('/agenda-calender',{},{
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


export const createAgenda = async(agendaInfo) =>{

    try {
        const {data} = await client.post('/agenda-calender/create',agendaInfo,{
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

export const deleteAgenda = async(id) =>{

    try {
        const {data} = await client.delete(`/agenda-calender/${id}`,{id},{
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

