import client from "./clinet";
const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

// delete a transaction
export const deleteTransaction = async (performedBy,Pno, transactionId,invoiceNumber, roles) => {
  if (!Pno || !transactionId || !roles) {
    return { error: "Missing required parameters" };
  }

  try {
    const { data } = await client.delete(
      `/transaction/${Pno}/delete`,
      {
        data: {performedBy, transactionId,invoiceNumber, roles }, 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
      }
    );
    return data;
  } catch (error) {
    const { response } = error;
    if (response?.data) {
      return response.data;
    }
    return { 
      error: error.message || "Failed to delete transaction",
      details: error 
    };
  }
};



// update transaction
export const updateMemberTransactionByInvoice = async (transactionData,roles) => {
  try {

    const response = await client.put(
      `/transaction/${transactionData.pno}/update`,
      {
        performedBy: transactionData.performedBy,
        invoiceNumber: transactionData.invoiceNumber,
        updateData: {
          invoiceDate: transactionData.invoiceDate,
          items: transactionData.items
        },
        roles: roles
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }
      }
    );
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        updatedData: response.data.data
      };
    }
    return { error: response.data.message || 'Update failed' };
    
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { 
      error: error.response?.data?.message || 'Failed to update transaction',
      details: error.response?.data?.error 
    };
  }
};