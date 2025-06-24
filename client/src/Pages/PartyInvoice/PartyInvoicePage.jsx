import React, { useState,useEffect, useMemo } from "react";
import {
  Container,
  Grid,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  Avatar,
  Box,
  Collapse,
  TableFooter,
  Stack
} from "@mui/material";
import {
  FileDownload,
  Add,
  Person,
  CalendarMonth,
  MeetingRoom,
  Restaurant,
  Receipt,
  Phone,
  LocationOn,
  Badge,
  Edit
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"


const PartyInvoicePage = () => {
  const location = useLocation();
  const [receivedData] = useState(location.state || {});
  const navigate = useNavigate();
  const [partyInvoice, setPartyInvoice] = useState(receivedData);
  const [expandedRows, setExpandedRows] = useState({});

  // Calculate totals
  const { venueTotal, menuTotal, grandTotal } = useMemo(() => {
    const venueTotal = partyInvoice.venueRows.reduce((sum, row) => {
      const subtotal = row.rental + row.acCharge + row.maintenance + row.security;
      const cgstAmount = subtotal * (row.cgst / 100);
      const sgstAmount = subtotal * (row.sgst / 100);
      return sum + subtotal + cgstAmount + sgstAmount;
    }, 0);

    const menuTotal = partyInvoice.menuRows.reduce((sum, row) => {
      const subtotal = row.qty * row.rate;
      const cgstAmount = subtotal * (row.cgstPercent / 100);
      const sgstAmount = subtotal * (row.sgstPercent / 100);
      return sum + subtotal + cgstAmount + sgstAmount;
    }, 0);

    return {
      venueTotal,
      menuTotal,
      grandTotal: venueTotal + menuTotal
    };
  }, []);

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExport = () => {
    // Prepare the data for export with formatting
    const data = [
      // Header section
      ["INVOICE", "", "", "", "", "", `Invoice #: ${partyInvoice.invoiceNumber}`],
      ["Member Details", "", "", "", "", "", `Date: ${dayjs(partyInvoice.invoiceDetails.invoiceDate).format('DD/MM/YYYY')}`],
      [],
      
      // Member details
      ["Member Name", partyInvoice.memberDetails.name, "", "", "Booking Date", dayjs(partyInvoice.invoiceDetails.bookingDate).format('DD/MM/YYYY')],
      ["Member ID", partyInvoice.memberDetails.id, "", "", "Function Date", dayjs(partyInvoice.invoiceDetails.functionDate).format('DD/MM/YYYY')],
      ["Address", partyInvoice.memberDetails.address, "", "", "Pax", partyInvoice.invoiceDetails.pax],
      ["GSTIN", partyInvoice.memberDetails.gstNo, "", "", "Mobile", partyInvoice.invoiceDetails.mobileNo || "N/A"],
      ["Nature of Function", partyInvoice.memberDetails.natureOfFunction],
      [],
      
      // Venue Charges header
      ["VENUE CHARGES", "", "", "", "", "", "", "", "", "", "", ""],
      ["Venue", "Session", "Rental", "AC Charge", "Maintenance", "Security", "CGST %", "SGST %", "Subtotal", "CGST Amt", "SGST Amt", "Total"],
      
      // Venue data rows
      ...partyInvoice.venueRows.map(row => {
        const subtotal = row.rental + row.acCharge + row.maintenance + row.security;
        const cgstAmount = subtotal * (row.cgst / 100);
        const sgstAmount = subtotal * (row.sgst / 100);
        const total = subtotal + cgstAmount + sgstAmount;
        
        return [
          row.name,
          row.session || "-",
          row.rental,
          row.acCharge,
          row.maintenance,
          row.security,
          row.cgst,
          row.sgst,
          subtotal,
          cgstAmount,
          sgstAmount,
          total
        ];
      }),
      
      // Venue summary
      ["Venue Total", "", "", "", "", "", "", "", "", "", "", venueTotal],
      [],
      
      // Menu Charges header
      ["MENU CHARGES", "", "", "", "", "", "", "", ""],
      ["Description", "Qty", "Rate", "Amount", "CGST %", "SGST %", "CGST Amt", "SGST Amt", "Total"],
      
      // Menu data rows
      ...partyInvoice.menuRows.map(row => {
        const amount = row.qty * row.rate;
        const cgstAmount = amount * (row.cgstPercent / 100);
        const sgstAmount = amount * (row.sgstPercent / 100);
        const total = amount + cgstAmount + sgstAmount;
        
        return [
          row.description,
          row.qty,
          row.rate,
          amount,
          row.cgstPercent,
          row.sgstPercent,
          cgstAmount,
          sgstAmount,
          total
        ];
      }),
      
      // Menu summary
      ["Menu Total", "", "", "", "", "", "", "", menuTotal],
      [],
      
      // Final summary
      ["SUMMARY", "", "", "", "", "", "", "", ""],
      ["Venue Total", "", "", "", "", "", "", "", venueTotal],
      ["Menu Total", "", "", "", "", "", "", "", menuTotal],
      ["GRAND TOTAL", "", "", "", "", "", "", "", grandTotal]
    ];
  
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
  
    // Add style definitions
    const style = {
      // Header styles
      "!A1": { s: { font: { bold: true, sz: 16 }, alignment: { horizontal: "left" } } },
      "!G1": { s: { font: { bold: true }, alignment: { horizontal: "right" } } },
      "!G2": { s: { alignment: { horizontal: "right" } } },
      
      // Section headers
      "!A10": { s: { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: "D3D3D3" } } } },
      "!A24": { s: { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: "D3D3D3" } } } },
      "!A38": { s: { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: "D3D3D3" } } } },
      
      // Column headers
      "!A11": { s: { font: { bold: true }, fill: { fgColor: { rgb: "E6E6E6" } } } },
      "!A25": { s: { font: { bold: true }, fill: { fgColor: { rgb: "E6E6E6" } } } },
      
      // Currency formatting
      "!C:I": { s: { numFmt: '"₹"#,##0.00' } }, // Format as Indian Rupees
      "!K:M": { s: { numFmt: '"₹"#,##0.00' } },
      "!D27:I27": { s: { numFmt: '"₹"#,##0.00' } },
      "!I40": { s: { numFmt: '"₹"#,##0.00', font: { bold: true } } },
      
      // Grand total
      "!A42:I42": { s: { font: { bold: true } } },
      "!I42": { s: { font: { bold: true, sz: 14 }, fill: { fgColor: { rgb: "FFD700" } } } }
    };
  
    // Merge cells for headers
    ws["!merges"] = [
      // Invoice header
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      // Section headers
      { s: { r: 9, c: 0 }, e: { r: 9, c: 11 } },
      { s: { r: 23, c: 0 }, e: { r: 23, c: 8 } },
      { s: { r: 37, c: 0 }, e: { r: 37, c: 8 } }
    ];
  
    // Apply column widths
    ws["!cols"] = [
      { wch: 20 }, // A
      { wch: 25 }, // B
      { wch: 10 }, // C
      { wch: 10 }, // D
      { wch: 12 }, // E
      { wch: 10 }, // F
      { wch: 8 },  // G
      { wch: 8 },  // H
      { wch: 12 }, // I
      { wch: 10 }, // J
      { wch: 10 }, // K
      { wch: 12 }  // L
    ];
  
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");
  
    // Generate the Excel file and trigger download
    XLSX.writeFile(wb, `Invoice_${partyInvoice.invoiceNumber}.xlsx`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4, mb: 12 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          p: 3,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          boxShadow: 3
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {partyInvoice.memberDetails.name}'s Event
            </Typography>
            <Typography variant="subtitle1">
              {dayjs(partyInvoice.invoiceDetails.functionDate).format('MMMM D, YYYY')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6">Invoice #</Typography>
            <Typography variant="h4" fontWeight="bold">
              {partyInvoice.invoiceNumber}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate("/party-invoice-billing",{state:{...receivedData,isEdit: true}})}
          >
            Edit Invoice
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={() => navigate(`/party-invoice/pdf-view`,{state:{...receivedData}})}
          >
            Export(PDF)
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExport}
          >
            Export(XLSX)
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    VENUE TOTAL
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                    ₹{venueTotal.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <MeetingRoom />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    MENU TOTAL
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                    ₹{menuTotal.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <Restaurant />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', bgcolor: 'primary.dark', color: 'white' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2">
                    GRAND TOTAL
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <Receipt />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Member and Event Details */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Member Details Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">Member Details</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon={<Person color="primary" />} label="Name" value={partyInvoice.memberDetails.name} />
                  <DetailItem icon={<Badge color="primary" />} label="Member ID" value={partyInvoice.memberDetails.id} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon={<Receipt color="primary" />} label="GSTIN" value={partyInvoice.memberDetails.gstNo} />
                  <DetailItem icon={<LocationOn color="primary" />} label="Address" value={partyInvoice.memberDetails.address} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem icon={<CalendarMonth color="primary" />} label="Nature of Function" value={partyInvoice.memberDetails.natureOfFunction} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Event Details Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <CalendarMonth />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">Event Details</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon={<CalendarMonth color="secondary" />} label="Booking Date" value={dayjs(partyInvoice.invoiceDetails.bookingDate).format('DD MMM YYYY')} />
                  <DetailItem icon={<CalendarMonth color="secondary" />} label="Invoice Date" value={dayjs(partyInvoice.invoiceDetails.invoiceDate).format('DD MMM YYYY')} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem icon={<CalendarMonth color="secondary" />} label="Function Date" value={dayjs(partyInvoice.invoiceDetails.functionDate).format('DD MMM YYYY')} />
                  <DetailItem icon={<Phone color="secondary" />} label="Mobile" value={partyInvoice.invoiceDetails.mobileNo} />
                </Grid>
                <Grid item xs={12}>
                  <DetailItem icon={<Person color="secondary" />} label="Number of Pax" value={partyInvoice.invoiceDetails.pax} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Venue Details Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
              <MeetingRoom />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">Venue Details</Typography>
            <Chip 
              label={`Total: ₹${venueTotal.toFixed(2)}`} 
              color="info" 
              sx={{ ml: 'auto', fontSize: '1rem', fontWeight: 'bold' }}
            />
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell>Venue</TableCell>
                  <TableCell>Session</TableCell>
                  <TableCell align="right">Rental</TableCell>
                  <TableCell align="right">AC Charge</TableCell>
                  <TableCell align="right">Maintenance</TableCell>
                  <TableCell align="right">Security</TableCell>
                  <TableCell align="right">CGST</TableCell>
                  <TableCell align="right">SGST</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partyInvoice.venueRows.map((row) => {
                  const isExpanded = expandedRows[row._id];
                  const subtotal = row.rental + row.acCharge + row.maintenance + row.security;
                  const cgstAmount = subtotal * (row.cgst / 100);
                  const sgstAmount = subtotal * (row.sgst / 100);
                  const rowTotal = subtotal + cgstAmount + sgstAmount;
                  
                  return (
                    <React.Fragment key={row._id}>
                      <TableRow hover onClick={() => toggleRowExpand(row._id)} sx={{ cursor: 'pointer' }}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.session}</TableCell>
                        <TableCell align="right">₹{row.rental.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{row.acCharge.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{row.maintenance.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{row.security.toFixed(2)}</TableCell>
                        <TableCell align="right">{row.cgst}%</TableCell>
                        <TableCell align="right">{row.sgst}%</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>₹{rowTotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={9} sx={{ p: 0, borderBottom: isExpanded ? null : 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Detailed Calculation
                              </Typography>
                              <Stack direction="row" spacing={4}>
                                <Box>
                                  <Typography variant="body2">Subtotal: ₹{subtotal.toFixed(2)}</Typography>
                                  <Typography variant="body2">CGST ({row.cgst}%): ₹{cgstAmount.toFixed(2)}</Typography>
                                  <Typography variant="body2">SGST ({row.sgst}%): ₹{sgstAmount.toFixed(2)}</Typography>
                                </Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  Total: ₹{rowTotal.toFixed(2)}
                                </Typography>
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Menu Details Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
              <Restaurant />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">Menu Details</Typography>
            <Chip 
              label={`Total: ₹${menuTotal.toFixed(2)}`} 
              color="success" 
              sx={{ ml: 'auto', fontSize: '1rem', fontWeight: 'bold' }}
            />
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">CGST</TableCell>
                  <TableCell align="right">SGST</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partyInvoice.menuRows.map((row) => {
                  const isExpanded = expandedRows[row._id];
                  const amount = row.qty * row.rate;
                  const cgstAmount = amount * (row.cgstPercent / 100);
                  const sgstAmount = amount * (row.sgstPercent / 100);
                  const rowTotal = amount + cgstAmount + sgstAmount;
                  
                  return (
                    <React.Fragment key={row._id}>
                      <TableRow hover onClick={() => toggleRowExpand(row._id)} sx={{ cursor: 'pointer' }}>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">{row.qty}</TableCell>
                        <TableCell align="right">₹{row.rate.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{amount.toFixed(2)}</TableCell>
                        <TableCell align="right">{row.cgstPercent}%</TableCell>
                        <TableCell align="right">{row.sgstPercent}%</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>₹{rowTotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, borderBottom: isExpanded ? null : 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Detailed Calculation
                              </Typography>
                              <Stack direction="row" spacing={4}>
                                <Box>
                                  <Typography variant="body2">Amount: {row.qty} × ₹{row.rate} = ₹{amount.toFixed(2)}</Typography>
                                  <Typography variant="body2">CGST ({row.cgstPercent}%): ₹{cgstAmount.toFixed(2)}</Typography>
                                  <Typography variant="body2">SGST ({row.sgstPercent}%): ₹{sgstAmount.toFixed(2)}</Typography>
                                </Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  Total: ₹{rowTotal.toFixed(2)}
                                </Typography>
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} align="right">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Menu Grand Total:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" fontWeight="bold">
                      ₹{menuTotal.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>

        {/* Final Summary */}
        
      </Container>
    </LocalizationProvider>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ mr: 1.5, color: 'text.secondary' }}>{icon}</Box>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {value}
      </Typography>
    </Box>
  </Box>
);

export default PartyInvoicePage;