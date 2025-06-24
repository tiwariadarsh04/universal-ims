exports.generateOTPVerificationEmail = (otp) => {
    const currentYear = new Date().getFullYear();
    const supportEmail = "support@konectile.com";
    const validityMinutes = 5;
    const logoUrl = "https://www.konectile.com/logo.png";
  
    return `
      <html lang="en">
      <head>
        <style>
          /* Base styles */
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333333;
          }
          
          /* Email container */
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          /* Header */
          .header {
            background-color: #3f51b5;
            padding: 20px;
            text-align: center;
          }
          
          .logo-img {
            height: 60px;
            width: auto;
            margin-bottom: 10px;
          }
          
          .logo-text {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
            display: block;
          }
          
          /* Content */
          .content {
            padding: 30px;
          }
          
          h1 {
            color: #2c3e50;
            margin-top: 0;
            font-size: 24px;
            text-align: center;
          }
          
          .otp-container {
            margin: 30px 0;
            text-align: center;
          }
          
          .otp-code {
            display: inline-block;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #3f51b5;
            background-color: #f0f4ff;
            padding: 15px 25px;
            border-radius: 6px;
            border: 1px dashed #3f51b5;
          }
          
          .note {
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
          }
          
          /* Footer */
          .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-top: 1px solid #eeeeee;
          }
          
          .footer a {
            color: #3f51b5;
            text-decoration: none;
          }
          
          /* Responsive */
          @media only screen and (max-width: 600px) {
            .content {
              padding: 20px;
            }
            
            .otp-code {
              font-size: 24px;
              padding: 12px 20px;
            }
            
            .logo-img {
              height: 50px;
            }
            
            .logo-text {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Konectile Logo" class="logo-img">
            <span class="logo-text">Konectile</span>
          </div>
          
          <div class="content">
            <h1>OTP Verification</h1>
            
            <p>Dear Member,</p>
            
            <p>We've received a request to verify your account. Please use the following One-Time Password (OTP) to complete your verification:</p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
            </div>
            
            <p>This OTP is valid for ${validityMinutes} minutes. Please do not share this code with anyone.</p>
            
            <div class="note">
              <strong>Note:</strong> If you didn't request this OTP, please ignore this email or contact our support team immediately at <a href="mailto:${supportEmail}">${supportEmail}</a>.
            </div>
            
            <p>Thank you for being a valued member!</p>
            
            <p>Best regards,<br>Team Konectile</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} Konectile. All rights reserved.</p>
            <p>
              <a href="mailto:${supportEmail}">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

exports.SendInvoiceAndBillingInfo = (name, pno, invoiceDate, invoiceNumber, items) => {
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = items.reduce((sum, item) => sum + (item.amount * item.gstPercentage / 100), 0);
    const total = subtotal + gstAmount;

    return `
    <html>
    <head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 700px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #1976d2;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: auto;
            margin-bottom: 15px;
        }
        .invoice-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
        }
        .invoice-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin: 5px 0 0;
        }
        .content {
            padding: 30px;
        }
        .details-container {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 30px;
        }
        .detail-box {
            flex: 1;
            min-width: 250px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #1976d2;
        }
        .detail-title {
            font-size: 16px;
            font-weight: 600;
            color: #1976d2;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .detail-title svg {
            margin-right: 8px;
        }
        .detail-item {
            margin-bottom: 8px;
            display: flex;
        }
        .detail-label {
            font-weight: 600;
            min-width: 100px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 15px;
        }
        th {
            background-color: #1976d2;
            color: white;
            text-align: left;
            padding: 12px 15px;
            font-weight: 600;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .total-row {
            font-weight: 600;
        }
        .grand-total {
            font-weight: 700;
            font-size: 16px;
            color: #1976d2;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            font-size: 14px;
            color: #666;
        }
        .button {
            display: inline-block;
            background-color: #1976d2;
            color: white !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
            <img src="https://www.konectile.com/logo.png" alt=" Club Logo" class="logo">
            <h1 class="invoice-title">INVOICE</h1>
            <p class="invoice-subtitle">${invoiceNumber}</p>
        </div>
        
        <div class="content">
            <div class="details-container">
                <div class="detail-box">
                    <div class="detail-title">
                        <!-- SVG icon placeholder for person -->
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1976d2">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Billed To
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Name:</span>
                        <span>${name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">P.No:</span>
                        <span>${pno}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Invoice Date:</span>
                        <span>${invoiceDate}</span>
                    </div>
                </div>
                
                <div class="detail-box">
                    <div class="detail-title">
                        <!-- SVG icon placeholder for business -->
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1976d2">
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                        </svg>
                        Konectile
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address:</span>
                        <span>Jamsedhpur, 833217, Jharkhand</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Organization:</span>
                        <span>Konectile</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">GSTIN:</span>
                        <span>20AAE********Z2</span>
                    </div>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>GST %</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => {
                        const unitPrice = item.amount / item.qty;
                        return `
                        <tr>
                            <td>${item.itemName}</td>
                            <td>${item.qty}</td>
                            <td>₹${unitPrice.toFixed(2)}</td>
                            <td>${item.gstPercentage}%</td>
                            <td>₹${item.amount.toFixed(2)}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="4">Subtotal</td>
                        <td>₹${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="4">GST Amount</td>
                        <td>₹${gstAmount.toFixed(2)}</td>
                    </tr>
                    <tr class="grand-total">
                        <td colspan="4">Total Amount</td>
                        <td>₹${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            
            <div class="button-container">
                <a href="https://clubims.vercel.app/" class="button">View Invoice Online</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Thank you </p>
            <p>&copy; ${new Date().getFullYear()} Konectile. All rights reserved.</p>
        </div>
    </div>
    </body>
    </html>`;
};


exports.SendOrderNotAcceptedNotification = (name, pno, invoiceDate, invoiceNumber, reason = "") => {
    return `
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .order-details {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #fff9f9;
            border-left: 4px solid #ff6b6b;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #777;
        }
        .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 10px 0;
            cursor: pointer;
            border-radius: 8px;
            background-color: #ff6b6b;
        }
        .button-container{
            text-align: center;
            margin-top: 20px;
        }
        .reason-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #ffc107;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
            <h1>Order Not Accepted</h1>
        </div>
        
        <p>Dear ${name},</p>
        
        <p>We regret to inform you that your recent order could not be accepted at this time.</p>
        
        <div class="order-details">
            <p><strong>Order Reference:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${invoiceDate}</p>
            <p><strong>Member ID:</strong> ${pno}</p>
        </div>
        
        <div class="reason-box">
            <p><strong>Reason:</strong> ${reason || "Please contact our support team for more information about your order status."}</p>
            <p>If you believe this is an error or would like more information, please don't hesitate to contact us.</p>
        </div>
        
        <p>We apologize for any inconvenience this may have caused and appreciate your understanding.</p>
        
        <div class="button-container">
            <a href="${`https://clubims.vercel.app/`}" class="button">Contact Support</a>
        </div>

        <div class="footer">
            <p>Thank you for your continued support!</p>
            <p>&copy; ${new Date().getFullYear()} Konectile</p>
        </div>
    </div>
    </body>
    </html>`;
};


exports.SendOrderAcceptedNotification = (name, pno, orderDate, orderNumber, items, estimatedDelivery = "") => {
    // Calculate totals (same as your invoice template)
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = items.reduce((sum, item) => sum + (item.amount * item.gstPercentage / 100), 0);
    const total = subtotal + gstAmount;

    return `
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            color: #4CAF50;
        }
        .order-details {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9fff9;
            border-left: 4px solid #4CAF50;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #777;
        }
        .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 10px 0;
            cursor: pointer;
            border-radius: 8px;
        }
        .button-container{
            text-align: center;
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            text-align: right;
            font-weight: bold;
        }
        .delivery-info {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #2196F3;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
            <p>Your order has been successfully accepted!</p>
        </div>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for your order. We're preparing your items and will notify you when they're on their way.</p>
        
        <div class="order-details">
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Member ID:</strong> ${pno}</p>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>GST</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.qty}</td>
                    <td>₹${(item.amount/item.qty).toFixed(2)}</td>
                    <td>${item.gstPercentage}%</td>
                    <td>₹${item.amount.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="total">Subtotal:</td>
                    <td>₹${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="4" class="total">GST:</td>
                    <td>₹${gstAmount.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="4" class="total"><strong>Order Total:</strong></td>
                    <td><strong>₹${total.toFixed(2)}</strong></td>
                </tr>
            </tfoot>
        </table>
        
        ${estimatedDelivery ? `
        <div class="delivery-info">
            <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
            <p>We'll send tracking information once your order ships.</p>
        </div>
        ` : ''}
        
        <p>If you have any questions about your order, please reply to this email or contact our support team.</p>
        
        <div class="button-container">
            <a href="${`https://clubims.vercel.app//orders/${orderNumber}`}" class="button">View Order Status</a>
        </div>

        <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>&copy; ${new Date().getFullYear()} Konectile</p>
        </div>
    </div>
    </body>
    </html>`;
};

exports.generatePasswordChangedEmail = (name) => {
    const currentYear = new Date().getFullYear();
    const supportEmail = "support@konectile.com";
    const logoUrl = "https://www.konectile.com/logo.png";
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Password Updated Successfully</title>
        <style>
          /* Base styles - matching existing design */
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333333;
          }
          
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          
          .header {
            background-color: #3f51b5;
            padding: 20px;
            text-align: center;
          }
          
          .logo-img {
            height: 60px;
            width: auto;
            margin-bottom: 10px;
          }
          
          .logo-text {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
            display: block;
          }
          
          .content {
            padding: 30px;
          }
          
          h1 {
            color: #2c3e50;
            margin-top: 0;
            font-size: 24px;
            text-align: center;
          }
          
          .success-icon {
            text-align: center;
            font-size: 60px;
            color: #4CAF50;
            margin: 20px 0;
          }
          
          .note {
            background-color: #e8f5e9;
            border-left: 4px solid #4CAF50;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
            border-radius: 0 4px 4px 0;
          }
          
          .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-top: 1px solid #eeeeee;
          }
          
          .footer a {
            color: #3f51b5;
            text-decoration: none;
          }
          
          @media only screen and (max-width: 600px) {
            .content {
              padding: 20px;
            }
            
            .logo-img {
              height: 50px;
            }
            
            .logo-text {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Konectile Logo" class="logo-img">
            <span class="logo-text">Konectile</span>
          </div>
          
          <div class="content">
            <div class="success-icon">✓</div>
            <h1>Password Changed Successfully</h1>
            
            <p>Dear ${name},</p>
            
            <p>Your Konectile account password has been successfully updated.</p>
            
            <div class="note">
              <strong>Security Tip:</strong> If you didn't make this change, please contact our support team immediately at <a href="mailto:${supportEmail}">${supportEmail}</a>.
            </div>
            
            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a unique password that you don't use elsewhere</li>
              <li>Updating your password regularly</li>
              <li>Enabling two-factor authentication if available</li>
            </ul>
            
            <p>Thank you for helping keep your account secure!</p>
            
            <p>Best regards,<br>Team Konectile</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear}  Konectile. All rights reserved.</p>
            <p>
              <a href="mailto:${supportEmail}">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

exports.generateLoginAlertEmail = (user, loginInfo) => {
  const { deviceInfo, ipAddress, location, isFirstLogin } = loginInfo;
  const currentYear = new Date().getFullYear();
  const supportEmail = "support@konectile.com";
  
  const subject = isFirstLogin 
    ? 'Welcome to Konectile - First Login Alert'
    : 'New Login Alert - Konectile';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #fafafa;
          color: #1a1a1a;
        }
        
        .container {
          width: 100%;
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .content {
          padding: 40px 32px;
        }
        
        .title-container {
          text-align: center;
          margin-bottom: 32px;
        }
        
        h1 {
          color: #1a1a1a;
          margin: 0;
          font-size: 26px;
          font-weight: 600;
          letter-spacing: -0.5px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          background: ${isFirstLogin ? '#dcfce7' : '#ffedd5'};
          color: ${isFirstLogin ? '#166534' : '#9a3412'};
        }
        
        .alert-box {
          background: ${isFirstLogin ? '#f0fdf4' : '#fff7ed'};
          border-radius: 12px;
          padding: 28px;
          margin: 0 0 40px 0;
          border: 1px solid ${isFirstLogin ? '#dcfce7' : '#ffedd5'};
        }
        
        .alert-box p {
          margin: 0;
          color: ${isFirstLogin ? '#166534' : '#9a3412'};
          font-size: 15px;
          line-height: 1.6;
        }
        
        .alert-box p:not(:last-child) {
          margin-bottom: 12px;
        }
        
        .info-section {
          background: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          padding: 28px;
          margin: 0 0 32px 0;
        }
        
        .info-section h3 {
          color: #1a1a1a;
          margin: 0 0 20px 0;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .info-item {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
        }
        
        .info-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
        
        .info-value {
          font-weight: 500;
          color: #1a1a1a;
          font-size: 14px;
        }
        
        .location-info {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 28px;
          margin: 0 0 32px 0;
        }
        
        .warning-box {
          background: #fef2f2;
          border: 1px solid #fee2e2;
          border-radius: 12px;
          padding: 28px;
          margin: 0 0 32px 0;
        }
        
        .warning-box p {
          color: #991b1b;
          margin: 0 0 20px 0;
          font-size: 15px;
        }
        
        .warning-box ol {
          margin: 0;
          padding-left: 20px;
          color: #991b1b;
        }
        
        .warning-box li {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .button {
          display: inline-block;
          background: #1a1a1a;
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          margin: 16px 0;
          transition: background-color 0.2s ease;
        }
        
        .button:hover {
          background: #333333;
        }
        
        .footer {
          background: #fafafa;
          padding: 32px;
          text-align: center;
          font-size: 13px;
          color: #666666;
          border-top: 1px solid #f0f0f0;
        }
        
        .footer a {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
        }
        
        .footer a:hover {
          text-decoration: underline;
        }
        
        .divider {
          height: 1px;
          background: #f0f0f0;
          margin: 32px 0;
        }
        
        .verification-text {
          text-align: center;
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }
        
        @media only screen and (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          
          .content {
            padding: 32px 24px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          h1 {
            font-size: 22px;
            flex-direction: column;
            gap: 8px;
          }
          
          .status-badge {
            align-self: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="title-container">
            <h1>
              ${isFirstLogin ? 'Welcome to Konectile' : 'New Login Alert'}
              <span class="status-badge">${isFirstLogin ? 'First Login' : 'New Device'}</span>
            </h1>
          </div>
          
          <div class="alert-box">
            <p>Hello ${user.name},</p>
            ${isFirstLogin 
              ? '<p>Welcome to Konectile! This is your first login to the system.</p>'
              : '<p>We detected a new login to your Konectile account.</p>'
            }
          </div>
          
          <div class="info-section">
            <h3>Login Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Time</span>
                <span class="info-value">${new Date().toLocaleString()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">IP Address</span>
                <span class="info-value">${ipAddress}</span>
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <h3>Device Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Device Type</span>
                <span class="info-value">${deviceInfo.device}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Browser</span>
                <span class="info-value">${deviceInfo.browser}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Operating System</span>
                <span class="info-value">${deviceInfo.os}</span>
              </div>
            </div>
          </div>
          
          ${location ? `
            <div class="location-info">
              <h3>Location Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">City</span>
                  <span class="info-value">${location.city || 'Unknown'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Country</span>
                  <span class="info-value">${location.country || 'Unknown'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Coordinates</span>
                  <span class="info-value">${location.latitude}, ${location.longitude}</span>
                </div>
                ${location.timezone ? `
                  <div class="info-item">
                    <span class="info-label">Timezone</span>
                    <span class="info-value">${location.timezone}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}
          
          ${!isFirstLogin ? `
            <div class="warning-box">
              <p><strong>Security Alert:</strong> If you didn't perform this login, please:</p>
              <ol>
                <li>Change your password immediately</li>
                <li>Enable two-factor authentication if available</li>
                <li>Contact our support team at <a href="mailto:${supportEmail}" class="button">${supportEmail}</a></li>
              </ol>
            </div>
          ` : ''}
          
          <div class="divider"></div>
          
          <p class="verification-text">
            For security reasons, please verify if this login was performed by you.
          </p>
        </div>
        
        <div class="footer">
          <p>&copy; ${currentYear} Konectile. All rights reserved.</p>
          <p>
            <a href="mailto:${supportEmail}">Contact Support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
};