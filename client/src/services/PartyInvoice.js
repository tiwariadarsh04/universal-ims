import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

export const getPrtyInvoices = async() =>{

    try {
        const {data} = await client.get('/party-invoice',{},{
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


export const createPartyInvoice = async(partyInfo) =>{

    try {
        const {data} = await client.post('/party-invoice/create',partyInfo,{
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

export const getSingleInvoice = async(id) =>{

    try {
        const {data} = await client.get(`/party-invoice/${id}`,{},{
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

// delete 

export const deletePartyInvoice = async(id) =>{

    try {
        const {data} = await client.delete(`/party-invoice/${id}`,{},{
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

export const updatePartyInvoice = async(id,updateData) =>{

    try {
        const {data} = await client.put(`/party-invoice/${id}`,updateData,{
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


export const getNextInvoiceNumber = async() =>{

    try {
        const {data} = await client.get('/party-invoice/next-number',{},{
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

// reset-counter

export const resetInvoiceCounter = async() =>{

    try {
            const {data} = await client.post('/party-invoice/reset-counter',{},{
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