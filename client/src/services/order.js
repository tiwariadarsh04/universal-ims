import client from "./clinet";
const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// create a new member
export const createOrder = async(orderInfo) =>{

    try {
        const {data} = await client.post('/order/create',orderInfo,{
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

// get all orders
export const getMemberOrders = async() =>{

    try {
        const {data} = await client.get('/order/get-all-order',{
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

// get accepted order
export const getAcceptedMemberOrder = async() =>{

    try {
        const {data} = await client.post('/order/get-accepted-orders',{
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

// delete order
export const deleteOrder = async(orderId) =>{

    try {
        const {data} = await client.delete(`/order/${orderId}/delete`, {
                headers: { 
                    'content-type':'application/json',
                    'Authorization': `Bearer ${user?.token}`
                 }
              });
        return data;
    } catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

// updateOrderStatus
export const updateOrderStatus = async(performedBy,orderId,status) =>{

    try {
        const {data} = await client.put(`/order/${orderId}/update`,{performedBy,orderId,status},{
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

// pendingcount of memberr
export const pendingOrderCountOfMember = async(memberId) =>{

    try {
        const {data} = await client.get(`/order/pending-count/?memberId=${memberId}`,{},{
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


// accepted-count of memberr
export const acceptedOrderOfMember = async(memberId) =>{

    try {
        const {data} = await client.get(`/order/accepted-count/?memberId=${memberId}`,{},{
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