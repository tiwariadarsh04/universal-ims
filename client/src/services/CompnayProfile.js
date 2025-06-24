import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// create a new event
export const createCompanyProfile = async(companyInfo) =>{

    try {
        const {data} = await client.post('/company-profile/create',companyInfo,{
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


// update an existing event
export const updateCompanyProfile = async(companyInfo) => {
    try {
        const {data} = await client.put('/company-profile/update', companyInfo, {
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

export const getCompanyProfile = async() => {
    try {
        const {data} = await client.get('/company-profile/fetch', {
            headers: { 
                'Content-Type': 'application/json',
            },
        });
        return data;
    }
    catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}       