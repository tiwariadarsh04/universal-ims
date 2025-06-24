import dayjs from 'dayjs';

// Helper function to format dates
const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

// Get all transactions from the API response
export const getAllTransactions = (transactions) => {
  if (!Array.isArray(transactions)) return [];
  
  return transactions.flatMap(memberData => {
    if (!memberData || !Array.isArray(memberData.TransactionList)) return [];
    
    return memberData.TransactionList.map(transaction => ({
      ...transaction,
      memberName: memberData.memberName || 'Unknown',
      memberPno: memberData.memberPno || '',
      memberID: memberData.memberID || '',
      date: transaction.invoiceDate,
      totalAmount: transaction.items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
    }));
  });
};

// Get member consumption statistics
export const getMemberConsumptionStats = (transactions) => {
  if (!Array.isArray(transactions)) return [];
  
  const memberStats = new Map();

  transactions.forEach(memberData => {
    if (!memberData || !Array.isArray(memberData.TransactionList)) return;
    
    const memberId = memberData.memberID || 'unknown';
    const memberName = memberData.memberName || 'Unknown';
    let totalConsumption = 0;
    let transactionCount = 0;
    let lastTransactionDate = null;
    let itemCategories = new Map();

    memberData.TransactionList.forEach(transaction => {
      if (!transaction || !Array.isArray(transaction.items)) return;
      
      transactionCount++;
      const transactionDate = new Date(transaction.invoiceDate);
      if (!lastTransactionDate || transactionDate > lastTransactionDate) {
        lastTransactionDate = transactionDate;
      }

      transaction.items.forEach(item => {
        if (!item) return;
        
        totalConsumption += item.amount || 0;
        
        // Track item categories
        const category = item.itemGroup === 3 ? 'Alcoholic' : 
                        item.itemGroup === 5 ? 'Kitchen' : 
                        item.itemGroup === 6 ? 'Snacks' : 'Others';
        
        if (!itemCategories.has(category)) {
          itemCategories.set(category, 0);
        }
        itemCategories.set(category, itemCategories.get(category) + (item.amount || 0));
      });
    });

    memberStats.set(memberId, {
      memberId,
      memberName,
      totalConsumption,
      transactionCount,
      lastTransactionDate,
      averageTransactionValue: transactionCount > 0 ? totalConsumption / transactionCount : 0,
      categoryBreakdown: Object.fromEntries(itemCategories),
      status: 'active'
    });
  });

  return Array.from(memberStats.values());
};

// Get item popularity statistics
export const getItemPopularityStats = (transactions) => {
  if (!Array.isArray(transactions)) return [];
  
  const itemStats = new Map();

  transactions.forEach(memberData => {
    if (!memberData || !Array.isArray(memberData.TransactionList)) return;
    
    memberData.TransactionList.forEach(transaction => {
      if (!transaction || !Array.isArray(transaction.items)) return;
      
      transaction.items.forEach(item => {
        if (!item || !item.itemName) return;
        
        if (!itemStats.has(item.itemName)) {
          itemStats.set(item.itemName, {
            itemName: item.itemName,
            totalQuantity: 0,
            totalRevenue: 0,
            transactionCount: 0,
            averagePrice: 0,
            category: item.itemGroup === 3 ? 'Alcoholic' : 
                     item.itemGroup === 5 ? 'Kitchen' : 
                     item.itemGroup === 6 ? 'Snacks' : 'Others',
            gstContribution: 0,
            transactions: []
          });
        }

        const stats = itemStats.get(item.itemName);
        stats.totalQuantity += item.qty || 0;
        stats.totalRevenue += item.amount || 0;
        stats.transactionCount++;
        stats.averagePrice = stats.totalQuantity > 0 ? stats.totalRevenue / stats.totalQuantity : 0;
        stats.gstContribution += (item.amount || 0) * ((item.gstPercentage || 0) / 100);
        
        // Add transaction to history
        stats.transactions.push({
          date: transaction.invoiceDate,
          memberName: memberData.memberName || 'Unknown',
          memberId: memberData.memberID || '',
          quantity: item.qty || 0,
          amount: item.amount || 0,
          invoiceNumber: transaction.invoiceNumber || ''
        });
      });
    });
  });

  return Array.from(itemStats.values());
};

// Get time series data for trends
export const getTimeSeriesData = (transactions) => {
  const dailyData = new Map();

  transactions.forEach(memberData => {
    memberData.TransactionList.forEach(transaction => {
      const date = formatDate(transaction.invoiceDate);
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          totalAmount: 0,
          transactionCount: 0,
          itemCount: 0,
          gstAmount: 0,
          categoryBreakdown: {
            Alcoholic: 0,
            Kitchen: 0,
            Snacks: 0,
            Others: 0
          }
        });
      }

      const dayData = dailyData.get(date);
      dayData.transactionCount++;
      
      transaction.items.forEach(item => {
        dayData.totalAmount += item.amount;
        dayData.itemCount += item.qty;
        dayData.gstAmount += item.amount * (item.gstPercentage / 100);
        
        const category = item.itemGroup === 3 ? 'Alcoholic' : 
                        item.itemGroup === 5 ? 'Kitchen' : 
                        item.itemGroup === 6 ? 'Snacks' : 'Others';
        dayData.categoryBreakdown[category] += item.amount;
      });
    });
  });

  return Array.from(dailyData.values()).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
};

// Get detailed member consumption
export const getDetailedMemberConsumption = (transactions) => {
  return transactions.map(memberData => ({
    memberId: memberData.memberID,
    memberName: memberData.memberName,
    memberPno: memberData.memberPno,
    transactions: memberData.TransactionList.map(transaction => ({
      transactionId: transaction._id,
      invoiceNumber: transaction.invoiceNumber,
      date: transaction.invoiceDate,
      items: transaction.items.map(item => ({
        itemName: item.itemName,
        quantity: item.qty,
        amount: item.amount,
        gstAmount: item.amount * (item.gstPercentage / 100),
        category: item.itemGroup === 3 ? 'Alcoholic' : 
                 item.itemGroup === 5 ? 'Kitchen' : 
                 item.itemGroup === 6 ? 'Snacks' : 'Others'
      })),
      totalAmount: transaction.items.reduce((sum, item) => sum + item.amount, 0),
      totalGst: transaction.items.reduce((sum, item) => 
        sum + (item.amount * (item.gstPercentage / 100)), 0)
    }))
  }));
};

// Get inventory utilization
export const getInventoryUtilization = (inventory, transactions) => {
  if (!Array.isArray(inventory) || !Array.isArray(transactions)) {
    console.log('Invalid input to getInventoryUtilization:', { inventory, transactions });
    return [];
  }

  const utilization = inventory.map(item => {
    if (!item || !item.itemName) {
      console.log('Invalid inventory item:', item);
      return null;
    }

    const itemTransactions = transactions.filter(txn => 
      txn && txn.items && txn.items.some(i => i && i.itemName === item.itemName)
    );

    const totalSold = itemTransactions.reduce((sum, txn) => {
      const itemInTxn = txn.items.find(i => i.itemName === item.itemName);
      return sum + (itemInTxn ? (itemInTxn.qty || 0) : 0);
    }, 0);

    const stockQuantity = item.stockQuantity || 0;
    const utilizationRate = stockQuantity > 0 
      ? (totalSold / stockQuantity) * 100 
      : 0;

    return {
      itemName: item.itemName,
      category: item.category || 'Others',
      stockQuantity,
      totalSold,
      utilizationRate: Math.min(utilizationRate, 100), // Cap at 100%
      lastUpdated: item.lastUpdated || new Date().toISOString()
    };
  }).filter(Boolean); // Remove any null items

  console.log('Processed inventory utilization:', utilization);
  return utilization;
};

// Get cost revenue analysis
export const getCostRevenueAnalysis = (transactions) => {
  if (!Array.isArray(transactions)) {
    console.log('Invalid input to getCostRevenueAnalysis:', transactions);
    return {
    totalRevenue: 0,
    totalCost: 0,
    totalGst: 0,
    categoryBreakdown: {
      Alcoholic: { revenue: 0, cost: 0, gst: 0 },
      Kitchen: { revenue: 0, cost: 0, gst: 0 },
      Snacks: { revenue: 0, cost: 0, gst: 0 },
      Others: { revenue: 0, cost: 0, gst: 0 }
    }
  };
  }

  const categoryBreakdown = {
    Alcoholic: { revenue: 0, cost: 0, gst: 0 },
    Kitchen: { revenue: 0, cost: 0, gst: 0 },
    Snacks: { revenue: 0, cost: 0, gst: 0 },
    Others: { revenue: 0, cost: 0, gst: 0 }
  };

  let totalRevenue = 0;
  let totalCost = 0;
  let totalGst = 0;

  transactions.forEach(txn => {
    if (!txn || !txn.items) return;

    txn.items.forEach(item => {
      if (!item) return;

      const category = item.category || 'Others';
      const revenue = parseFloat(item.amount) || 0;
      const cost = parseFloat(item.cost) || 0;
      const gst = parseFloat(item.gst) || 0;

      categoryBreakdown[category].revenue += revenue;
      categoryBreakdown[category].cost += cost;
      categoryBreakdown[category].gst += gst;

      totalRevenue += revenue;
      totalCost += cost;
      totalGst += gst;
    });
  });

  const result = {
    totalRevenue,
    totalCost,
    totalGst,
    categoryBreakdown
  };

  console.log('Processed cost revenue analysis:', result);
  return result;
};

// Get low stock alerts
export const getLowStockAlerts = (inventory) => {
  if (!Array.isArray(inventory)) {
    console.log('Invalid input to getLowStockAlerts:', inventory);
    return [];
  }

  const alerts = inventory
    .filter(item => {
      if (!item || !item.itemName) return false;
      const currentStock = item.stockQuantity || 0;
      const minStock = item.minStock || 0;
      return currentStock <= minStock;
    })
    .map(item => ({
      itemName: item.itemName,
      category: item.category || 'Others',
      currentStock: item.stockQuantity || 0,
      minStock: item.minStock || 0,
      status: item.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'
    }));

  console.log('Processed low stock alerts:', alerts);
  return alerts;
};