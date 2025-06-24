import client from "./clinet";

const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
// create a new member
export const createNewMember = async(memberInfo) =>{

    try {
        const {data} = await client.post('/club-member/create',memberInfo,{
                headers: { 
                    'content-type':'application/json',
                    'Authorization': `Bearer ${user?.token}`
                 },
              });
        return data;
    } catch (error) {
        console.log(error)
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

// add family member
export const addFamilyMember = async(memberId, familyInfo) =>{

    try {
        const {data} = await client.post(`/club-member/${memberId}/family`,familyInfo,{
                headers: { 
                    'content-type':'application/json',
                    'Authorization': `Bearer ${user?.token}`
                 },
              });
        return data;
    } catch (error) {
        console.log(error)
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

// change member status
export const changeMemberStatus = async(memberId, MembershipStatus) =>{

    try {
        const {data} = await client.patch(`/club-member/${memberId}/status`,{MembershipStatus},{
                headers: { 
                    'content-type':'application/json',
                    'Authorization': `Bearer ${user?.token}`
                 },
              });
        return data;
    } catch (error) {
        console.log(error)
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}

// edit member Profile
export const editMemberProfile = async(memberId, updatedInfo) =>{

    try {
        const {data} = await client.put(`/club-member/${memberId}`,updatedInfo,{
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


// create in bulk member
export const createBulkMember = async(memberInfoArray) =>{

    try {
        const {data} = await client.post('/club-member/createBulkMembers',memberInfoArray,{
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


// individual transaction by member
export const getMemberProfile = async(userId) =>{

    try {
        const {data} = await client.get(`/club-member/${userId}/get-single-member-profile`,{
                headers: { 
                    'content-type':'application/json'
                 },
              });
        return data;
    } catch (error) {
        const {response} = error;
        if(response?.data) return response.data;
        return {error: error.message || error};
    }
}


// get member details
export const getAllClubMember = async() =>{

    try {
        const {data} = await client.get('/club-member/getAllMember',{
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

// get all transaction of members
export const getMemberTransactions = async() =>{

    try {
        const {data} = await client.get('/club-member/member-transactions',{
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

// individual transaction by member
export const getIndividualMemberTransaction = async(memberId) =>{

    try {
        const {data} = await client.get(`/club-member/${memberId}/member-wise-transaction`,{
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

// generate / create a transaction on member
export const createMemberTransactionByInvoice = async(itemInfo) =>{

    try {
        const {data} = await client.post(`/club-member/create-transaction`,itemInfo,{
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

// next-memberId
export const getNextMemberID = async() =>{

    try {
        const {data} = await client.get('/club-member/next-id',{
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

