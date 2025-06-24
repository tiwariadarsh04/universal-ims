export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

export const amountInWords = (amount) => {
  // Handle negative numbers
  if (amount < 0) {
      return 'Negative ' + amountInWords(-amount);
  }

  // Handle decimal part (paise)
  const decimalPart = Math.round((amount % 1) * 100);
  const integerPart = Math.floor(amount);

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (amount === 0) return 'Zero Rupees Only';

  const convertLessThanOneThousand = (num) => {
      if (num === 0) return '';
      let current = '';
      
      const hundreds = Math.floor(num / 100);
      const remainder = num % 100;
      
      if (hundreds > 0) {
          current += units[hundreds] + ' Hundred';
      }
      
      if (remainder > 0) {
          if (current !== '') current += ' and ';
          
          if (remainder < 10) {
              current += units[remainder];
          } else if (remainder < 20) {
              current += teens[remainder - 10];
          } else {
              const ten = Math.floor(remainder / 10);
              const unit = remainder % 10;
              current += tens[ten];
              if (unit > 0) {
                  current += ' ' + units[unit];
              }
          }
      }
      
      return current;
  };

  let result = '';
  const crore = Math.floor(integerPart / 10000000);
  let remaining = integerPart % 10000000;
  
  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;
  
  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;
  
  if (crore > 0) {
      result += convertLessThanOneThousand(crore) + ' Crore';
  }
  
  if (lakh > 0) {
      if (result !== '') result += ' ';
      result += convertLessThanOneThousand(lakh) + ' Lakh';
  }
  
  if (thousand > 0) {
      if (result !== '') result += ' ';
      result += convertLessThanOneThousand(thousand) + ' Thousand';
  }
  
  if (remaining > 0) {
      if (result !== '') result += ' ';
      result += convertLessThanOneThousand(remaining);
  }
  
  if (result === '') {
      result = 'Zero';
  }
  
  // Handle paise
  let paisePart = '';
  if (decimalPart > 0) {
      paisePart = ' and ' + convertLessThanOneThousand(decimalPart) + ' Paise';
  }
  
  return result + ' Rupees' + paisePart + ' Only';
};