

export const formatToIndianCurrency = (value) => {
    if (!value || isNaN(Number(value))) return "N/A";
    const numValue = parseFloat(value.toString());
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };