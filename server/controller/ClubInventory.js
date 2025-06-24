const Inventory = require("../models/ClubInventory"); // Import the Inventory model

// 1. Insert a single inventory item
const insertSingleInventory = async (req, res) => {
  try {
    const itemData = req.body; // Get data from the request body
    const newItem = new Inventory(itemData);
    const savedItem = await newItem.save();
    res.status(201).json({
      success: true,
      message: "Single inventory item inserted successfully",
      data: savedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error inserting single inventory item",
      error: error.message,
    });
  }
};

// 2. Insert bulk inventory items
const insertBulkInventory = async (req, res) => {
  try {
    const itemsData = req.body; // Get array of items from the request body
    const savedItems = await Inventory.insertMany(itemsData);
    res.status(201).json({
      success: true,
      message: "Bulk inventory items inserted successfully",
      data: savedItems,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error inserting bulk inventory items",
      error: error.message,
    });
  }
};

// 3. Delete an inventory item by ItemCode
const deleteInventoryItem = async (req, res) => {
  try {
    const { itemCode } = req.params; 
    const {roles} = req.body;

    if (!itemCode ) {
      return res.status(400).json({ 
        success: false,
        message: "ItemCode is required" 
      });
    }

    // Check admin privileges
    if (!roles || !roles.includes('admin')) {
      return res.status(403).json({ 
        success: false,
        message: "You are not authorized!." 
      });
    }


    const deletedItem = await Inventory.findOneAndDelete({ ItemCode: itemCode });
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting inventory item",
      error: error.message,
    });
  }
};

// 4. Update an inventory item by ItemCode
const updateInventoryItem = async (req, res) => {
  try {
    const { itemCode } = req.params;
    const updateData = req.body;
    const updatedItem = await Inventory.findOneAndUpdate(
      { ItemCode: itemCode },
      { $set: updateData },
      { new: true } 
    );

    console.log(updatedItem)
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating inventory item",
      error: error.message,
    });
  }
};

// 5. Fetch all inventory items
const fetchAllInventoryItems = async (req, res) => {
  try {
    const allItems = await Inventory.find({});
    res.status(200).json({
      success: true,
      message: "All inventory items fetched successfully",
      data: allItems,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching all inventory items",
      error: error.message,
    });
  }
};

// 6. Fetch a single inventory item by ItemCode
const fetchSingleInventoryItem = async (req, res) => {
  try {
    const { itemCode } = req.params; // Get ItemCode from URL params
    const item = await Inventory.findOne({ ItemCode: itemCode });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Single inventory item fetched successfully",
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching single inventory item",
      error: error.message,
    });
  }
};


const getNextItemCode = async (req, res) => {
  try {
    // Find the document with the highest ItemCode
    const lastItem = await Inventory.findOne()
      .sort({ ItemCode: -1 }) // Sort in descending order
      .select('ItemCode')      // Only select the ItemCode field
      .lean();                 // Return as plain JavaScript object

    let nextItemCode = 100; // Default starting value if no items exist

    if (lastItem && lastItem.ItemCode) {
      // Increment the highest ItemCode by 1
      nextItemCode = lastItem.ItemCode + 1;
    }

    res.status(200).json({
      success: true,
      message: 'Next available item code retrieved successfully',
      data: nextItemCode
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving next item code',
      error: error.message
    });
  }
};

module.exports = {
  insertSingleInventory,
  insertBulkInventory,
  deleteInventoryItem,
  updateInventoryItem,
  fetchAllInventoryItems,
  fetchSingleInventoryItem,
  getNextItemCode
};