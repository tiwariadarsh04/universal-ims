import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// create a new member
export const createInventoryItem = async(itemData) =>{


    try {
        const {data} = await client.post('/club-inventory/create',itemData,{
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

// create a bulk item 
export const bulkCreateItem = async(itemData) =>{

    try {
        const {data} = await client.post('/club-inventory/create-in-bulk',itemData,{
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

// get all the items from inventory

export const fetchInventoryItems = async() =>{

    try {
        const {data} = await client.get('/club-inventory/fetch-all-items',{
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

// fetch-next-item-code

export const fetchNextItemCode = async() =>{

    try {
        const {data} = await client.get('/club-inventory/fetch-next-item-code',{
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

// delete-item

export const deleteInventoryItem = async(itemCode,roles) =>{

    try {
        const {data} = await client.delete(`/club-inventory/${itemCode}/delete`,{
            data: { roles },
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

// update inventory- update-item'

export const updateInventoryItem = async(itemcode,updateData) =>{
    

    try {
        const {data} = await client.put(`/club-inventory/${itemcode}/update`,updateData,{
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