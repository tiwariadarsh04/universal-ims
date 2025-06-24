const twilio = require('twilio');
const argon2 = require('argon2');
const { isValidObjectId, default: mongoose } = require("mongoose");

const MemberProfile = require("../models/memberProfile");
const activityLogController = require('../controller/ActivityLog')
const { sendError } = require("../utils/helper");
const { generateMailTransporter } = require("../utils/email");
const { SendInvoiceAndBillingInfo } = require("../utils/EmailTemplate");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// create a new member profile
exports.createMemberProfile = async(req,res) =>{
    const {MemberID,Name, Pno, Contact, Email, Password, MembershipStatus, MemberSince, Transaction, FamilyMember,Role} = req.body;

    console.log(req.body);

    const existingMember = await MemberProfile.findOne({ $or: [{ MemberID }, { Pno }] });
    if (existingMember) {
      return res.status(400).json({ message: 'MemberID or pno. already exists' });
    }

    const newMemberProfile = new MemberProfile({MemberID, Name, Pno, Contact, Email, Password, MembershipStatus, MemberSince, Transaction, FamilyMember, Role});
    await newMemberProfile.save();
    res.status(201).json({ message: 'Member profile created successfully', member: newMemberProfile});
}

// bulk member creation
exports.createBulkMemberProfile = async (req, res) => {
  const memberProfiles = req.body;

  if (!Array.isArray(memberProfiles) || memberProfiles.length === 0) {
    return sendError(res, 'Input must be a non-empty array of member profiles');
  }

  // Check for duplicate emails or phone numbers
  const emails = memberProfiles.map((member) => member.Email);
  const pnos = memberProfiles.map((member) => member.Pno);

  const existingMembers = await MemberProfile.find({
    $or: [{ Email: { $in: emails } }, { Pno: { $in: pnos } }],
  });

  if (existingMembers.length > 0) {
    const duplicateEmails = existingMembers.map((member) => member.Email);
    const duplicatePnos = existingMembers.map((member) => member.Pno);
    return res.status(400).json({
      message: 'Duplicate email or phone number found',
      duplicates: { emails: duplicateEmails, pnos: duplicatePnos },
    });
  }

  try {
    // Hash passwords for all member profiles
    const hashedMemberProfiles = await Promise.all(
      memberProfiles.map(async (member) => {
        const hashedPassword = await argon2.hash(member.Password);
        return { ...member, Password: hashedPassword };
      })
    );

    // Insert the member profiles with hashed passwords
    const createdMembers = await MemberProfile.insertMany(hashedMemberProfiles);

    res.status(201).json({ message: 'Member profiles created successfully', members: createdMembers });
  } catch (error) {
    console.error('Error creating member profiles:', error);
    res.status(500).json({ message: 'Failed to create member profiles' });
  }
};

// get a single Member profile
exports.getSingleMemberProfile = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return sendError(res, "Invalid request!");
  }

  try {
    const member = await MemberProfile.findById(userId);

    if (!member) {
      return sendError(res, "Invalid request, MemberProfile not found!", 404);
    }

    res.json(member);
  } catch (error) {
    console.error("Error fetching member profile:", error);
    return sendError(res, "Internal server error", 500);
  }
};

// get latest member profile created baseed on date

exports.getLatestMemberProfile = async(req, res) =>{
    const result = await MemberProfile.find().sort({createdAt: '-1'}).limit(12);
    res.json(result)
}

// get all the member list
exports.getAllMemberList = async(req,res) =>{
    const result = await MemberProfile.find()

    res.json(result);
}

// edit a member 
exports.editMemberProfile = async (req, res) => {
  try {
    const { MemberID } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.MemberID;
    delete updates.Transaction;
    delete updates.MemberSince;
    delete updates.Role;
    delete updates.session_id;

    // If password is being updated, hash it
    if (updates.Password) {
      updates.Password = await argon2.hash(updates.Password);
    }

    // Convert email to lowercase if provided
    if (updates.Email) {
      updates.Email = updates.Email.toLowerCase();
    }

    const updatedMember = await MemberProfile.findOneAndUpdate(
      { MemberID },
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-Password -session_id'); // Exclude sensitive fields

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({
      message: 'Member profile updated successfully',
      member: updatedMember
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating member profile',
      error: error.message 
    });
  }
};

// addd family member
exports.addFamilyMember = async (req, res) => {
  try {
    const { MemberID } = req.params;
    const { Name, Relation } = req.body;

    if (!Name || !Relation) {
      return res.status(400).json({ 
        message: 'Name and Relation are required' 
      });
    }

    const validRelations = ['son', 'daughter', 'wife', 'husband'];
    if (!validRelations.includes(Relation)) {
      return res.status(400).json({ 
        message: `Relation must be one of: ${validRelations.join(', ')}` 
      });
    }

    const newFamilyMember = {
      Name,
      Relation
    };

    const updatedMember = await MemberProfile.findOneAndUpdate(
      { MemberID },
      { $push: { FamilyMember: newFamilyMember } },
      { new: true }
    ).select('-Password -session_id'); // Exclude sensitive fields

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(201).json({
      message: 'Family member added successfully',
      member: updatedMember,
      newFamilyMember
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding family member',
      error: error.message 
    });
  }
};

// change membership status
exports.changeMemberStatus = async (req, res) => {
  try {
    const { MemberID } = req.params;
    const { MembershipStatus } = req.body;

    if (!MembershipStatus || !['active', 'inactive'].includes(MembershipStatus)) {
      return res.status(400).json({ 
        message: 'Valid MembershipStatus (active/inactive) is required' 
      });
    }

    const updatedMember = await MemberProfile.findOneAndUpdate(
      { MemberID },
      { $set: { MembershipStatus } },
      { new: true }
    ).select('-Password -session_id'); // Exclude sensitive fields

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({
      message: `Member status updated to ${MembershipStatus}`,
      member: updatedMember
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error changing member status',
      error: error.message 
    });
  }
};

// get all transction of a particular member 
exports.getMemberTransctionList = async (req, res) => {
  try {
    // Fetch all members with their transactions
    const members = await MemberProfile.find({}).select('Name MemberID Pno Contact Email Transaction');

    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'No members found' });
    }

    // Extract transactions from all members
    const allTransactions = members.flatMap((member) => {
      return member.Transaction.map((transaction) => ({
        memberName: member.Name,
        memberID : member.MemberID,
        memberPno: member.Pno, 
        memberContact: member.Contact, 
        memberEmail: member.Email,
        ...transaction.toObject(), 
      }));
    });

    if (allTransactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.status(200).json({ message: 'Transactions fetched successfully', transactions: allTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// get transaction by member
exports.getTransactionsByMember = async (req, res) => {
  try {
    const { memberId } = req.params; 

    console.log(memberId)

    // Fetch the member by their ID and include their transactions
    const member = await MemberProfile.findById(memberId).select('Name Pno Contact Email Transaction');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Extract transactions for the member
    const transactions = member.Transaction.map((transaction) => ({
      memberName: member.Name,
      memberPno: member.Pno,
      memberContact: member.Contact,
      memberEmail: member.Email,
      ...transaction.toObject(), // Convert Mongoose document to plain object
    }));

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this member' });
    }

    res.status(200).json({ message: 'Transactions fetched successfully', transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// save a single item transaction 
exports.saveTransactionDetails = async (req,res) => {
  try {
    const { memberID, invoiceNumber, invoiceDate, itemName, qty, amount,gstPercentage  } = req.body
    // Find the member by MemberID
    const member = await MemberProfile.findOne({MemberID:memberID });

    if (!member) return sendError(res, "Member not found!")

    // Create a new transaction entry
    const newTransaction = {
      ItemName: itemName, 
      Qty: qty, 
      Amount: amount, 
      TotalAmount: totalAmount,
      InvoiceDate: invoiceDate,
      InvoiceNumber: invoiceNumber
    };

    // Check if a transaction for the current month already exists
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    let transaction = member.Transaction.find((t) => t.Month === currentMonth);

    if (!transaction) {
      // Create a new transaction for the current month
      transaction = {
        Month: currentMonth,
        FromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of the month
        ToDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // End of the month
        TransactionList: [newTransaction],
      };
      member.Transaction.push(transaction);
    } else {
      // Add the new transaction to the existing month's transaction list
      transaction.TransactionList.push(newTransaction);
    }

    // Save the updated member profile
    await member.save();

    res.status(201).json({ message: 'Transaction created successfully', transactionMember: member});
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

// create multi transactions
exports.saveMultiTransaction = async (req, res) => {
  const {performedBy, memberID, invoiceNumber, invoiceDate, items } = req.body;

  // Validate required fields
  if ( !performedBy || !memberID || !invoiceNumber || !invoiceDate || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'All fields are required, and items must be a non-empty array' });
  }

  try {

    let member;
    // Find the member by MemberID
    member = await MemberProfile.findOne({ Pno: memberID });    

    if (!member) {
      let findMemberByMemberId = await MemberProfile.findOne({MemberID: memberID});

      if(!findMemberByMemberId) 
        return res.status(404).json({ success: false, message: 'Member not found' });

      member = findMemberByMemberId;
    }

    if(member.MembershipStatus === 'inactive') 
      return res.status(404).json({ success: false, message: 'Billing can not be done as member is inactive.' });

    // Create a new transaction entry
    const newTransaction = {
      invoiceNumber,
      invoiceDate: new Date(invoiceDate),
      items: items.map((item) => ({
        itemCode: item.itemCode,  
        itemName: item.itemName,
        itemGroup: item.itemGroup,
        qty: item.qty,
        amount: item.amount,
        gstPercentage: item.gstPercentage,
        purchaseRate: item.purchaseRate,
      })),
    };


    const transactionDate = new Date(invoiceDate);
    const transactionMonth = transactionDate.toLocaleString('default', { month: 'long' });
    const transactionYear = transactionDate.getFullYear();

    // Find or create a transaction for the month
    let transaction = member.Transaction.find((t) => {
      const tYear = new Date(t.FromDate).getFullYear();
      return t.Month === transactionMonth && tYear === transactionYear;
    });

    if (!transaction) {
      transaction = {
        Month: transactionMonth,
        FromDate: new Date(transactionYear, transactionDate.getMonth(), 1), // Start of the month
        ToDate: new Date(transactionYear, transactionDate.getMonth() + 1, 0), // End of the month
        TransactionList: [newTransaction],
      };
      member.Transaction.push(transaction);
    } else {
      transaction.TransactionList.push(newTransaction);
    }

    // Save the updated member profile
    await member.save();

    await activityLogController.recordActivity(
      'create', 
      newTransaction.invoiceNumber, 
      {
        _id: performedBy.id,
        username: performedBy.username,
        role: performedBy.roles,
        name: performedBy.name, 
      }
    );


    // Send email notification
    const transport = generateMailTransporter();
    await transport.sendMail({
      from: process.env.NODE_MAILER_USERNAME,
      to: member.Email,
      subject: `Order Invoice - ${invoiceNumber}`,
      html: SendInvoiceAndBillingInfo(member.Name, member.Pno, invoiceDate, invoiceNumber, items),
    });

    return res.status(200).json({ success: true, message: 'Transaction saved successfully', data: member });

    // Send SMS notification -  No balance in twilio ( 20$ spend for 342 sms oh shit )
      const itemsMessage = items
      .map((item, index) => {
        const itemTotal = item.amount; // amount already includes qty * unit price
        const itemGST = itemTotal * item.gstPercentage / 100; // GST for the item
        return `${index + 1}. ${item.itemName} - Qty: ${item.qty}, Amount: ₹${itemTotal.toFixed(2)} (GST: ₹${itemGST.toFixed(2)})`;
      })
      .join('\n');

      // Calculate total amount with GST
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0); // Sum of all amounts
      const gstAmount = items.reduce((sum, item) => sum + (item.amount * item.gstPercentage / 100), 0); // Sum of GST for all items
      const totalAmount = subtotal + gstAmount; // Total amount including GST

      // Format total amount
      const formattedTotalAmount = `₹${totalAmount.toFixed(2)}`;

        const formattedContact = `+91${member.Contact}`;
        const smsBody = `Hi Mr. ${member.Name},\n\nInvoice Number: ${invoiceNumber}\nInvoice Date: ${new Date(invoiceDate).toLocaleDateString()}\n\nYour order details:\n${itemsMessage}\n\nTotal Amount: ${formattedTotalAmount}\n\nCheck your all billing and invoices online at\n https://noaclub.vercel.app\n and login with your credentials\n\n Email: ${member.Email}\nPassword:${member.MemberID}\n\nThank you,\nNoamundi Club`;

          
          const smsResponse = await client.messages.create({
            body: smsBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedContact,
          });
          console.log('Twilio Response:', smsResponse);

          // Return success response
          res.status(200).json({ success: true, message: 'Transaction saved successfully', data: member });

  } catch (error) {
    console.error('Error saving transaction:', error);

    // Handle Twilio-specific errors
    if (error.code === 21211) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    } else if (error.code === 21614) {
      return res.status(400).json({ success: false, message: 'This phone number is not SMS-capable' });
    }

    // Generic error response
    res.status(500).json({ success: false, message: 'Failed to save transaction', error: error.message });
  }
};


// optimized transaction list 
exports.getMemberTransactionListV2 = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sort = '-Transaction.createdAt',
      fields = 'Name Pno Contact Email Transaction',
      search,
      startDate,
      endDate,
    } = req.query;

    const aggregationPipeline = [];
    const matchStage = {};

    // Search filter
    if (search) {
      matchStage.$or = [
        { Name: { $regex: search, $options: 'i' } },
        { Pno: { $regex: search, $options: 'i' } },
        { Email: { $regex: search, $options: 'i' } },
        { 'Transaction.reference': { $regex: search, $options: 'i' } }
      ];
    }

    // Date filtering (applied before unwind)
    if (startDate || endDate) {
      matchStage['Transaction.$elemMatch'] = {};
      if (startDate) matchStage['Transaction.$elemMatch'].FromDate = { $gte: new Date(startDate) };
      if (endDate) matchStage['Transaction.$elemMatch'].ToDate = { $lte: new Date(endDate) };
    }

    if (Object.keys(matchStage).length > 0) {
      aggregationPipeline.push({ $match: matchStage });
    }

    // Unwind transactions to work with individual records
    aggregationPipeline.push({ $unwind: '$Transaction' });

    // Reapply date filters after unwind (if needed)
    const postUnwindMatch = {};
    if (startDate) postUnwindMatch['Transaction.FromDate'] = { $gte: new Date(startDate) };
    if (endDate) postUnwindMatch['Transaction.ToDate'] = { $lte: new Date(endDate) };

    if (Object.keys(postUnwindMatch).length > 0) {
      aggregationPipeline.push({ $match: postUnwindMatch });
    }

    // Count total matching transactions
    const countPipeline = [...aggregationPipeline, { $count: 'total' }];
    const totalResult = await MemberProfile.aggregate(countPipeline);
    const totalCount = totalResult[0]?.total || 0;

    // Apply sorting and pagination
    aggregationPipeline.push(
      { $sort: { [sort.startsWith('-') ? sort.slice(1) : sort]: sort.startsWith('-') ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) },
      { $project: {
        memberId: '$_id',
        memberName: '$Name',
        memberPno: '$Pno',
        memberContact: '$Contact',
        memberEmail: '$Email',
        transaction: '$Transaction'
      }}
    );

    const transactions = await MemberProfile.aggregate(aggregationPipeline);

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: 'No transactions found matching your criteria'
      });
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      total: totalCount,
      page: Number(page),
      pages: Math.ceil(totalCount / limit),
      data: transactions
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? `Server error: ${error.message}`
        : 'Failed to fetch transactions',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};


exports.getNextMemberId = async (req, res) => {
  try {
    // Get the current maximum member ID from the database
    const maxMember = await MemberProfile.findOne()
      .sort({ MemberID: -1 })
      .select('MemberID')
      .lean();

    let nextSeq = 1;
    
    if (maxMember && maxMember.MemberID) {
      // Extract the numeric part from the highest existing ID
      const match = maxMember.MemberID.match(/P-(\d+)/);
      if (match && match[1]) {
        nextSeq = parseInt(match[1], 10) + 1;
      }
    }

    // Format the new ID
    const newId = `P-${nextSeq.toString().padStart(4, '0')}`;

    res.status(200).json({ success: true, memberId: newId });
    
  } catch (error) {
    console.error('Error generating member ID:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate member ID'
    });
  }
};