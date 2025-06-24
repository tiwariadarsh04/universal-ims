import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  Container,
  Button,
  useTheme
} from "@mui/material";
import { styled } from '@mui/system';
import LOGO from '../../../assets/logo.png';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { PdfHeader } from "./PdfHeader";
import DesktopMessage from "./DesktopMessage";
import { alpha } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme?.spacing?.(4) || '32px',
  background: alpha(theme?.palette?.background?.paper || '#ffffff', 0.95),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`
}));

const InvoiceHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme?.spacing?.(4) || '32px',
  '& img': {
    width: '80px',
    height: 'auto',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  }
}));

const CompanyInfo = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  '& .MuiTypography-root': {
    color: theme?.palette?.text?.primary || '#000000',
    marginBottom: theme?.spacing?.(0.5) || '4px'
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme?.spacing?.(2) || '16px',
  color: theme?.palette?.primary?.main || '#1976d2',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '40px',
    height: '3px',
    background: `linear-gradient(90deg, ${theme?.palette?.primary?.main || '#1976d2'}, ${theme?.palette?.secondary?.main || '#dc004e'})`,
    borderRadius: '2px'
  }
}));

const StyledTable = styled(Box)(({ theme }) => ({
  marginTop: theme?.spacing?.(3) || '24px',
  '& .MuiGrid-container': {
    padding: theme?.spacing?.(1.5) || '12px',
    borderBottom: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: alpha(theme?.palette?.primary?.main || '#1976d2', 0.05)
    }
  }
}));

const SummaryBox = styled(Box)(({ theme }) => ({
  marginTop: theme?.spacing?.(2) || '16px',
  '& .MuiPaper-root': {
    borderRadius: '12px',
    padding: theme?.spacing?.(2) || '16px',
    background: `linear-gradient(135deg, ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.05)} 0%, ${alpha(theme?.palette?.secondary?.main || '#dc004e', 0.05)} 100%)`
  }
}));

const SignatureBox = styled(Box)(({ theme }) => ({
  marginTop: theme?.spacing?.(4) || '32px',
  display: 'flex',
  justifyContent: 'space-between',
  '& .MuiBox-root': {
    textAlign: 'center',
    '& .MuiTypography-root': {
      marginBottom: theme?.spacing?.(1) || '8px'
    }
  }
}));

const InvoiceTemplate = () => {
  const [size, setSize] = useState('Compact');
  const navigate = useNavigate();
  const location = useLocation();
  const { state: invoice } = location;
  
  const [companyProfile, setCompanyProfile] = useState('');
  const [address , setAddress] = useState('');
  const [flag , setFlag] = useState(false);
    
    useEffect(() => {
      const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
      if (localLogo) {
        setCompanyProfile(localLogo);
      }
      setFlag(true);
    },[]);

  // Memoized calculations
  const venueTotals = useMemo(() => {
    return invoice.venueRows.map(venue => {
      const subtotal = venue.rental + venue.acCharge + venue.maintenance + venue.security;
      const cgstAmount = subtotal * (venue.cgst / 100);
      const sgstAmount = subtotal * (venue.sgst / 100);
      const total = subtotal + cgstAmount + sgstAmount;
      return { ...venue, subtotal, cgstAmount, sgstAmount, total };
    });
  }, [invoice.venueRows]);

  const menuTotals = useMemo(() => {
    return invoice.menuRows.map(menu => {
      const subtotal = menu.qty * menu.rate;
      const cgstAmount = subtotal * (menu.cgstPercent / 100);
      const sgstAmount = subtotal * (menu.sgstPercent / 100);
      const total = subtotal + cgstAmount + sgstAmount;
      return { ...menu, subtotal, cgstAmount, sgstAmount, total };
    });
  }, [invoice.menuRows]);

  const menuSubtotals = useMemo(() => {
    return {
      qty: menuTotals.reduce((sum, item) => sum + item.qty, 0),
      subtotal: menuTotals.reduce((sum, item) => sum + item.subtotal, 0),
      cgstAmount: menuTotals.reduce((sum, item) => sum + item.cgstAmount, 0),
      sgstAmount: menuTotals.reduce((sum, item) => sum + item.sgstAmount, 0),
      total: menuTotals.reduce((sum, item) => sum + item.total, 0)
    };
  }, [menuTotals]);

  const venueGrandTotal = useMemo(() => 
    venueTotals.reduce((sum, venue) => sum + venue.total, 0), 
    [venueTotals]
  );

  const menuGrandTotal = useMemo(() => 
    menuSubtotals.total, 
    [menuSubtotals]
  );

  const grandTotal = useMemo(() => 
    venueGrandTotal + menuGrandTotal, 
    [venueGrandTotal, menuGrandTotal]
  );

  const totalCGST = useMemo(() => 
    venueTotals.reduce((sum, venue) => sum + venue.cgstAmount, 0) + menuSubtotals.cgstAmount,
    [venueTotals, menuSubtotals]
  );

  const totalSGST = useMemo(() => 
    venueTotals.reduce((sum, venue) => sum + venue.sgstAmount, 0) + menuSubtotals.sgstAmount,
    [venueTotals, menuSubtotals]
  );

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Convert number to words (simplified version)
  const numberToWords = (num) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const convertLessThanOneThousand = (n) => {
      if (n === 0) return '';
      if (n < 10) return units[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + units[n % 10];
      return units[Math.floor(n / 100)] + ' Hundred ' + convertLessThanOneThousand(n % 100);
    };
    
    let result = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const hundred = Math.floor(num / 100);
    num %= 100;
    
    if (crore > 0) result += convertLessThanOneThousand(crore) + ' Crore ';
    if (lakh > 0) result += convertLessThanOneThousand(lakh) + ' Lakh ';
    if (thousand > 0) result += convertLessThanOneThousand(thousand) + ' Thousand ';
    if (hundred > 0) result += convertLessThanOneThousand(hundred) + ' Hundred ';
    if (num > 0) result += convertLessThanOneThousand(num);
    
    return result.trim() + ' Rupees Only';
  };

  const generatePDFFromHTMLAlternativeV2 = async () => {
    try {
      // Get the invoice container
      const input = document.getElementById('invoice-container');
      if (!input) {
        console.error('Invoice container not found!');
        return;
      }

      // const hideBtn = document.querySelector('.no-print');
      // hideBtn.style.display='none';
      
      // Get the dimensions of the element
      const { width, height } = input.getBoundingClientRect();
      
      // Create a PDF with appropriate dimensions
      const pdf = new jsPDF({
        orientation: height > width ? 'portrait' : 'landscape',
        unit: 'px',
        format: [input.scrollWidth, input.scrollHeight]
      });
      
      // Convert to canvas
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Add the image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, input.scrollWidth, input.scrollHeight);
      
      // Save the PDF
      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
      console.log('PDF generated successfully');
      // hideBtn.style.display='';
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // hideBtn.style.display='';
    }
  };

  const generatePDFFromHTMLAlternative = async () => {
    try {
      // Get the invoice container
      const input = document.getElementById('invoice-container');
      if (!input) {
        console.error('Invoice container not found!');
        return;
      }

      const hideBtn = document.querySelector('.no-print');
      if (hideBtn) hideBtn.style.display = 'none';
      
      // Get the dimensions of the element
      const { width, height } = input.getBoundingClientRect();
      
      // Convert to canvas
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Calculate dimensions for A4 (in pixels at 96dpi)
      const a4Width = 794;  // 210mm in pixels (210 * 96 / 25.4)
      const a4Height = 1123; // 297mm in pixels (297 * 96 / 25.4)
      
      // Calculate aspect ratio and scaling factor
      const aspectRatio = canvas.width / canvas.height;
      let pdfWidth, pdfHeight;
      
      if (aspectRatio > a4Width / a4Height) {
        // Width is the limiting factor
        pdfWidth = a4Width;
        pdfHeight = pdfWidth / aspectRatio;
      } else {
        // Height is the limiting factor
        pdfHeight = a4Height;
        pdfWidth = pdfHeight * aspectRatio;
      }
      
      // Create a PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'px',
        format: [a4Width, a4Height]
      });
      
      // Center the content on the A4 page
      const xOffset = (a4Width - pdfWidth) / 2;
      const yOffset = (a4Height - pdfHeight) / 2;
      
      // Add the image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
      
      // Save the PDF
      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
      console.log('PDF generated successfully');
      if (hideBtn) hideBtn.style.display = '';
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (hideBtn) hideBtn.style.display = '';
    }
  };

  const handleDownload = (size) => {    
    if(size == 'compact'){
      generatePDFFromHTMLAlternativeV2();
      return;
    }
    if(size == 'a4'){
      generatePDFFromHTMLAlternative();
      return;
    }
    alert("Please select an size ")
  };

  function formatTextAfterThreeWords(text) {
    const words = text?.split(/\s+/);

    let formattedText = "";
    for (let i = 0; i < words?.length; i++) {
      formattedText += words[i];
      if ((i + 1) % 3 === 0 && (i + 1) < words?.length) {
        formattedText += "\n";
      } else if ((i + 1) < words?.length) {
        formattedText += " ";
      }
    }
    setAddress(formattedText);
}

useEffect(()=>{
  formatTextAfterThreeWords(companyProfile?.address);
},[flag])

  return (
    <>
      <PdfHeader 
        onBack={() => navigate(-1)} 
        onDownload={handleDownload} 
        size={size}
        title={`#${invoice.invoiceNumber}`}
        handleA4={() => setSize('a4')}
        handleCompact={() => setSize('compact')}
      />
      <DesktopMessage/>
      <Container id="invoice-container" maxWidth='lg' sx={{ mt: 12, mb: 12 }}>
        <StyledPaper elevation={5}>
          <InvoiceHeader>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Invoice #{invoice.invoiceNumber}
              </Typography>
              <Box mt={1}>
                <img src={companyProfile?.logoUrl || LOGO} alt="Company Logo" />
              </Box>
            </Box>
            <CompanyInfo>
              <Typography variant="body1" fontWeight="bold">
                {companyProfile?.name}
              </Typography>
              <Typography variant="body1" sx={{width:'14em'}}>
                {address}
              </Typography>
              <Typography variant="body1">
                {companyProfile?.email}
              </Typography>
              <Typography variant="body1">
                Mobile: {companyProfile?.contact}
              </Typography>
              <Typography variant="body1">
                GSTIN: {invoice.gstin}
              </Typography>
            </CompanyInfo>
          </InvoiceHeader>

          {/* Member and Invoice Details */}
          <Grid container spacing={3} mt={3}>
            <Grid item xs={12} sm={6}>
              <SectionTitle variant="h6">
                Bill to:
              </SectionTitle>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {invoice.memberDetails.name}
              </Typography>
              <Typography variant="body1" mt={1}>
                Member ID: {invoice.memberDetails.id}
                <br />
                {invoice.memberDetails.address}
                <br />
                GSTIN: {invoice.memberDetails.gstNo}
                <br />
                Function: {invoice.memberDetails.natureOfFunction}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <SectionTitle variant="h6">
                Event Details
              </SectionTitle>
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                  <Typography fontWeight="bold">
                    Invoice date:
                  </Typography>
                  <Typography>
                    {formatDate(invoice.invoiceDetails.invoiceDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                  <Typography fontWeight="bold">
                    Function date:
                  </Typography>
                  <Typography>
                    {formatDate(invoice.invoiceDetails.functionDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                  <Typography fontWeight="bold">
                    No. of Pax:
                  </Typography>
                  <Typography>
                    {invoice.invoiceDetails.pax}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Venue Charges Section */}
          <Box mt={4}>
            <SectionTitle variant="h6">
              Venue Charges
            </SectionTitle>
            <StyledTable>
              <Paper variant="outlined" sx={{ p: 1 }}>
                {/* Header Row */}
                <Grid container sx={{ display: { xs: "none", sm: "flex" } }}>
                  <Grid item sm={3}>
                    <Typography variant="caption" fontWeight="medium">
                      Venue Description
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      Session
                    </Typography>
                  </Grid>
                  <Grid item sm={1.3}>
                    <Typography variant="caption" fontWeight="medium" textAlign="right">
                      Rental
                    </Typography>
                  </Grid>
                  <Grid item sm={1.3}>
                    <Typography variant="caption" fontWeight="medium" textAlign="right">
                      AC Charge
                    </Typography>
                  </Grid>
                  <Grid item sm={1.3}>
                    <Typography variant="caption" fontWeight="medium" textAlign="right">
                      Maintenance
                    </Typography>
                  </Grid>
                  <Grid item sm={1.1}>
                    <Typography variant="caption" fontWeight="medium" textAlign="right">
                      Security
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography variant="caption" fontWeight="medium" textAlign="right">
                      CGST %
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography variant="caption" fontWeight="medium" textAlign="right">
                      SGST %
                    </Typography>
                  </Grid>
                  <Grid item sm={1} textAlign="right">
                    <Typography variant="caption" fontWeight="medium">
                      Total
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ display: { xs: "none", sm: "block" }, my: 1 }} />

                {/* Data Rows */}
                {venueTotals.map((venue, index) => (
                  <React.Fragment key={index}>
                    <Grid container sx={{ py: 1 }}>
                      <Grid item xs={12} sm={3}>
                        <Typography fontWeight="medium">
                          {venue.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <Typography textAlign="center">
                          {venue.session || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.3}>
                        <Typography textAlign="right">
                          {formatCurrency(venue.rental)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.3}>
                        <Typography textAlign="right">
                          {formatCurrency(venue.acCharge)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.3}>
                        <Typography textAlign="right">
                          {formatCurrency(venue.maintenance)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.1}>
                        <Typography textAlign="right">
                          {formatCurrency(venue.security)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <Typography textAlign="right">
                          {venue.cgst}%
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <Typography textAlign="right">
                          {venue.sgst}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={1} textAlign="right">
                        <Typography fontWeight="bold">
                          {formatCurrency(venue.total)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                  </React.Fragment>
                ))}

                {/* Venue Total */}
                <Grid container sx={{ py: 1 }}>
                  <Grid item xs={10} sm={10} textAlign="left">
                    <Typography fontWeight="bold">
                      Venue Total:
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sm={2} textAlign="right">
                    <Typography fontWeight="bold">
                      {formatCurrency(venueGrandTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </StyledTable>
          </Box>

          {/* Menu Charges Section */}
          <Box mt={4}>
            <SectionTitle variant="h6">
              Menu Charges
            </SectionTitle>
            <StyledTable>
              <Paper variant="outlined" sx={{ p: 1 }}>
                {/* Header Row */}
                <Grid container sx={{ display: { xs: "none", sm: "flex" } }}>
                  <Grid item sm={3}>
                    <Typography variant="caption" fontWeight="medium">
                      Item Description
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      Qty
                    </Typography>
                  </Grid>
                  <Grid item sm={1.2}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      Rate
                    </Typography>
                  </Grid>
                  <Grid item sm={1.2}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      Subtotal
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      CGST%
                    </Typography>
                  </Grid>
                  <Grid item sm={1.2}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      SGST%
                    </Typography>
                  </Grid>
                  <Grid item sm={1}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      CGST Amt
                    </Typography>
                  </Grid>
                  <Grid item sm={1.2}>
                    <Typography variant="caption" fontWeight="medium" textAlign="center">
                      SGST Amt
                    </Typography>
                  </Grid>
                  <Grid item sm={1} textAlign="center">
                    <Typography variant="caption" fontWeight="medium">
                      Total Amt
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ display: { xs: "none", sm: "block" }, my: 1 }} />

                {/* Data Rows */}
                {menuTotals.map((menu, index) => (
                  <React.Fragment key={index}>
                    <Grid container sx={{ py: 1 }}>
                      <Grid item xs={12} sm={3}>
                        <Typography fontWeight="medium">
                          {menu.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <Typography textAlign="center">
                          {menu.qty}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.2}>
                        <Typography textAlign="center">
                          {formatCurrency(menu.rate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.2}>
                        <Typography textAlign="center">
                          {formatCurrency(menu.subtotal)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <Typography textAlign="center">
                          {menu.cgstPercent}%
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.2}>
                        <Typography textAlign="center">
                          {menu.sgstPercent}%
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1}>
                        <Typography textAlign="center">
                          {formatCurrency(menu.cgstAmount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1.2}>
                        <Typography textAlign="center">
                          {formatCurrency(menu.sgstAmount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={1} textAlign="center">
                        <Typography fontWeight="bold">
                          {formatCurrency(menu.total)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                  </React.Fragment>
                ))}

                {/* Menu Subtotals */}
                <Grid container sx={{ py: 1 }}>
                  <Grid item xs={3} sm={3} textAlign="left">
                    <Typography fontWeight="bold">
                      Menu Subtotal:
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1} textAlign="center">
                    <Typography fontWeight="bold">
                      {menuSubtotals.qty}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1.2} textAlign="center">
                    <Typography fontWeight="bold">
                      -
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1.2} textAlign="center">
                    <Typography fontWeight="bold">
                      {formatCurrency(menuSubtotals.subtotal)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1} textAlign="center">
                    <Typography fontWeight="bold">
                      -
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1.2} textAlign="center">
                    <Typography fontWeight="bold">
                      -
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1} textAlign="center">
                    <Typography fontWeight="bold">
                      {formatCurrency(menuSubtotals.cgstAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1.2} textAlign="center">
                    <Typography fontWeight="bold">
                      {formatCurrency(menuSubtotals.sgstAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sm={1} textAlign="center">
                    <Typography fontWeight="bold">
                      {formatCurrency(menuSubtotals.total)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </StyledTable>
          </Box>

          {/* Summary Section */}
          <SummaryBox>
            <Paper variant="outlined">
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={8} sm={6}>
                      <Typography fontWeight="bold">
                        Venue Total:
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={6} textAlign="right">
                      <Typography>
                        {formatCurrency(venueGrandTotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={8} sm={6}>
                      <Typography fontWeight="bold">
                        Menu Total:
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={6} textAlign="right">
                      <Typography>
                        {formatCurrency(menuGrandTotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={8} sm={6}>
                      <Typography fontWeight="bold">
                        Total CGST:
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={6} textAlign="right">
                      <Typography>
                        {formatCurrency(totalCGST)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={8} sm={6}>
                      <Typography fontWeight="bold">
                        Total SGST:
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={6} textAlign="right">
                      <Typography>
                        {formatCurrency(totalSGST)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={8} sm={6}>
                      <Typography variant="h6" fontWeight="bold">
                        GRAND TOTAL:
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={6} textAlign="right">
                      <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(grandTotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography fontStyle="italic">
                        <strong>Amount in word </strong>: {numberToWords(grandTotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Paper>
          </SummaryBox>

          {/* Signatures */}
          <SignatureBox>
            <Box>
              <Typography>Member's Signature:</Typography>
              <Box sx={{ height: 50, borderBottom: '1px solid black', width: 200 }}></Box>
            </Box>
            <Box>
              <Typography>Manager's Signature:</Typography>
              <Box sx={{ height: 50, borderBottom: '1px solid black', width: 200 }}></Box>
            </Box>
          </SignatureBox>
        </StyledPaper>
      </Container>
    </>
  );
};

export default InvoiceTemplate;