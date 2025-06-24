const PasswordResetToken = require('../models/PasswordResetToken');
const User = require('../models/user');
const MemberProfile = require('../models/memberProfile');
const { generateOTP, generateMailTransporter } = require('../utils/email');
const { generateOTPVerificationEmail, generatePasswordChangedEmail } = require('../utils/EmailTemplate');
const { sendError } = require('../utils/helper');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken')
 
// Add a new user
exports.addUser = async (req, res) => {
  try {

    const { username, name, email, password, roles, allowed_device_fingerprint, allowed_latitude, allowed_longitude } = req.body;

    if(!username || !name || !email || !password) 
      return sendError(res, "Required field can't be empty.");

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendError(res, "username already exists");
    }
 
    // Create a new user
    const newUser = new User({
      username,
      name,
      email,
      password, 
      roles,
      allowed_device_fingerprint: roles === 'superadmin' ? allowed_device_fingerprint : undefined,
      allowed_latitude: roles === 'superadmin' ? allowed_latitude : undefined,
      allowed_longitude: roles === 'superadmin' ? allowed_longitude : undefined,
    });
 
    // Save the user to the database
    await newUser.save();
 
    // Respond with the created user
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
// Delete a user (only superadmin can delete)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {userInfo} = req.body;

    // Check if the user ID is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if the user is trying to delete themselves
    if (userInfo.id.toString() === userId) {
      return res.status(403).json({ message: 'You cannot delete yourself' });
    }

    // Check if the user to be deleted is a superadmin
    if (user.roles.toString() === 'superadmin' && userInfo.roles.toString() !== 'superadmin') {
      return res.status(403).json({ message: 'You cannot delete a superadmin user' });
    }
 
    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    // Respond with the deleted user
    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
// Update a user (superadmin and admin can update)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, roles, allowed_device_fingerprint, allowed_latitude, allowed_longitude } = req.body;
 
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    // Check if the requester is a superadmin or admin
    if (req.user.roles !== 'superadmin' && req.user.roles !== 'admin') {
      return res.status(403).json({ message: 'Only superadmin and admin can update users' });
    }
 
    // Only superadmin can change the roles of other users
    if (roles && req.user.roles !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can change the roles of users' });
    }
 
    // Update user fields
    user.username = username || user.username;
    user.password = password || user.password; // Hash the password in production
    user.roles = roles || user.roles;
    user.allowed_device_fingerprint = roles === 'superadmin' ? allowed_device_fingerprint : user.allowed_device_fingerprint;
    user.allowed_latitude = roles === 'superadmin' ? allowed_latitude : user.allowed_latitude;
    user.allowed_longitude = roles === 'superadmin' ? allowed_longitude : user.allowed_longitude;
 
    // Save the updated user
    await user.save();
 
    // Respond with the updated user
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get a user by username
exports.getUserByID = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id)

    // check username 
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    const isUserExist = await User.findById(id);
    if (!isUserExist) {
      return res.status(400).json({ message: 'No user found!' });
    }
    // Respond with the  user
    res.status(200).json({ message: 'User fetched successfully', user: isUserExist });
 
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get user role
exports.getUserRole = async (req, res) => {
  try {
    const { username } = req.body; 

    // Check username
    if (!username) {
      return res.status(400).json({ success: false, error: 'username is required' });
    }

    const isUserExist = await User.findOne({ username }).select('roles');
    if (!isUserExist) {
      return res.status(404).json({ success: false, message: 'No user found!' });
    }

    // Respond with the user role
    res.status(200).json({ success: true, message: 'User Role fetched successfully', userRole: isUserExist.roles });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllApplicationUser = async (req, res) => {
  try {

    const applicationUser = await User.find();
    if(!applicationUser) return sendError(res, "No user exist!")

    // Respond with the user role
    res.status(200).json({ success: true, message: 'Application user fetch successfully.', user:applicationUser });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return sendError(res, 'Email is missing!', 400);

    const member = await MemberProfile.findOne({ Email: email });
    if (!member) return sendError(res, "If this email exists, we'll send a recovery OTP", 404);

    await PasswordResetToken.deleteMany({ owner: member._id });

    const OTP = await generateOTP();
    const newResetPasswordOTP = new PasswordResetToken({
      owner: member._id,
      token: OTP
    });

    await newResetPasswordOTP.save();

    const transport = generateMailTransporter();
    await transport.sendMail({
      from: process.env.NODE_MAILER_USERNAME,
      to: member.Email,
      subject: `OTP for Password Recovery`,
      html: generateOTPVerificationEmail(OTP),
    });

    res.json({ 
      message: "If this email exists in our system, you'll receive an OTP shortly",
      debug: { memberId: member._id } 
    });

  } catch (error) {
    console.error('Password reset error:', error);
    sendError(res, 'Something went wrong. Please try again later.', 500);
  }
};
 

// otp verification
exports.verifyOTP = async (req, res) => {
  const { email, OTP } = req.body;

  if (!email || !OTP) {
    return sendError(res, "Email and OTP are required!", 400);
  }

  try {
    const member = await MemberProfile.findOne({ Email: email });
    if (!member) {
      return sendError(res, "Invalid OTP or expired. Please try again.", 400);
    }

    const tokenDoc = await PasswordResetToken.findOne({ owner: member._id });
    if (!tokenDoc) {
      return sendError(res, "Invalid OTP or expired. Please request a new one.", 400);
    }

    // Check if token is expired
    if (tokenDoc.isExpired()) {
      await PasswordResetToken.findByIdAndDelete(tokenDoc._id);
      return sendError(res, "OTP has expired. Please request a new one.", 400);
    }

    const isOTPValid = await argon2.verify(tokenDoc.token, OTP);
    if (!isOTPValid) {
      return sendError(res, "Invalid OTP. Please try again.", 400);
    }

    // Clean up the token
    await PasswordResetToken.findByIdAndDelete(tokenDoc._id);

    // Generate a short-lived token for the password reset step
    const tempToken = generateTempToken(member._id);
    
    res.json({ 
      success: true, 
      message: "OTP verified successfully!",
      tempToken, 
      expiresIn: "5 minutes" 
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

// Helper function example
function generateTempToken(userId) {
  return jwt.sign(
    { userId, purpose: 'password_reset' },
    process.env.SECRET_KEY,
    { expiresIn: '5m' }
  );
}
// change password 

exports.changePassword = async (req, res) => {
  const { newPassword, email, tempToken } = req.body;

  // Input validation
  if (!newPassword || !email || !tempToken) {
    return sendError(res, "New password, email, and verification token are required", 400);
  }

  try {
    // Verify temp token first
    const decoded = jwt.verify(tempToken, process.env.SECRET_KEY);
    if (decoded.purpose !== 'password_reset') {
      return sendError(res, "Invalid verification token", 401);
    }

    const member = await MemberProfile.findOne({ Email: email });
    if (!member) {
      return sendError(res, "Account not found", 404);
    }


    // Verify token belongs to this user
    if (decoded.userId !== member._id.toString()) {
      return sendError(res, "Unauthorized access", 403);
    }

    // Check password strength
    if (newPassword.length < 8) {
      return sendError(res, "Password must be at least 8 characters", 400);
    }

    // Verify new password is different
    const isSamePassword = await argon2.verify(member.Password, newPassword);
    if (isSamePassword) {
      return sendError(res, "New password must be different from current password", 400);
    }
    
    // Hash and save new password
    member.Password = newPassword
    await member.save();


    // Send notification email
    try {
      const transport = generateMailTransporter();
      await transport.sendMail({
        from: process.env.NODE_MAILER_USERNAME,
        to: member.Email,
        subject: `Password Changed Successfully`,
        html: generatePasswordChangedEmail(member.Name),
      });
    } catch (emailError) {
      console.error("Failed to send password change email:", emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      success: true,
      message: "Password reset successfully",
      changedAt: new Date() 
    });

  } catch (error) {
    console.error("Password change error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, "Invalid or expired verification token", 401);
    }
    
    return sendError(res, "Failed to reset password. Please try again.", 500);
  }
};


exports.changePasswordV1 = async (req, res) =>{
  const {newPassword, email, tempToken} = req.body

  if(!newPassword || !email) return sendError(res, "New Password and email are missing!");

  if(!tempToken) return sendError(res, "No Auth token provided");

  const decoded = jwt.verify(tempToken, process.env.SECRET_KEY);
  if (decoded.purpose !== 'password_reset') {
    return sendError(res, "Invalid verification token", 401);
  }

  const member = await MemberProfile.findOne({ Email: email });
    if (!member) 
      return sendError(res, "No member found with this email", 404);

    const matched = await argon2.verify(member.Password, newPassword);

    if(matched) return sendError(res, "New password must be different from old password.");

    member.Password = newPassword
    await member.save();

    const transport = generateMailTransporter();

      await transport.sendMail({
        from: process.env.NODE_MAILER_USERNAME,
        to: member.Email,
        subject: `Password Changed successfully`,
        html: generatePasswordChangedEmail(member.Name),
      });

  res.json({message: " Reset password is successfully."})


}
 