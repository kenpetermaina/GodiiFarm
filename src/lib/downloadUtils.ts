// Download utility functions for exporting data

export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.error("No data to download");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csv = headers.join(",") + "\n";
  
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle commas in values by wrapping in quotes
      if (typeof value === "string" && value.includes(",")) {
        return `"${value}"`;
      }
      return value ?? "";
    });
    csv += values.join(",") + "\n";
  });

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (data: any, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadReport = (title: string, content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateMilkReport = (milkRecords: any[], cows: any[]) => {
  let report = `MILK PRODUCTION REPORT\n`;
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += `${"=".repeat(80)}\n\n`;

  report += `Total Records: ${milkRecords.length}\n`;
  report += `Total Milk Produced: ${milkRecords.reduce((s, r) => s + (r.amount_liters || r.amount || 0), 0)} Liters\n\n`;

  report += `BREAKDOWN BY SESSIONS:\n`;
  report += `${"=".repeat(80)}\n`;
  
  const morning = milkRecords.filter(r => r.session === 'Morning').reduce((s, r) => s + (r.amount_liters || r.amount || 0), 0);
  const lunch = milkRecords.filter(r => r.session === 'Lunch').reduce((s, r) => s + (r.amount_liters || r.amount || 0), 0);
  const evening = milkRecords.filter(r => r.session === 'Evening').reduce((s, r) => s + (r.amount_liters || r.amount || 0), 0);

  report += `Morning: ${morning} L\n`;
  report += `Lunch: ${lunch} L\n`;
  report += `Evening: ${evening} L\n\n`;

  report += `BREAKDOWN BY COW:\n`;
  report += `${"=".repeat(80)}\n`;

  const cowTotals: Record<string, number> = {};
  milkRecords.forEach(r => {
    cowTotals[r.cow_id || r.cowId] = (cowTotals[r.cow_id || r.cowId] || 0) + (r.amount_liters || r.amount || 0);
  });

  Object.entries(cowTotals)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .forEach(([cowId, total]) => {
      const cow = cows.find(c => c.id === cowId);
      const cowName = cow ? `${cow.tag_number || cow.tag} - ${cow.name}` : cowId;
      report += `${cowName}: ${total} L\n`;
    });

  return report;
};

export const generateExpensesReport = (expenses: any[]) => {
  let report = `EXPENSES REPORT\n`;
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += `${"=".repeat(80)}\n\n`;

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  report += `Total Expenses: KES ${total.toLocaleString()}\n\n`;

  report += `BREAKDOWN BY CATEGORY:\n`;
  report += `${"=".repeat(80)}\n`;

  const categories: Record<string, number> = {};
  expenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  Object.entries(categories)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .forEach(([category, amount]) => {
      const percentage = ((amount / total) * 100).toFixed(1);
      report += `${category}: KES ${(amount as number).toLocaleString()} (${percentage}%)\n`;
    });

  report += `\nDETAILED EXPENSES:\n`;
  report += `${"=".repeat(80)}\n`;
  report += `Date | Category | Description | Amount (KES)\n`;
  report += `${"-".repeat(80)}\n`;

  expenses.forEach(e => {
    report += `${e.date} | ${e.category} | ${e.description || "—"} | ${e.amount.toLocaleString()}\n`;
  });

  return report;
};

export const generateIncomeReport = (incomeRecords: any[]) => {
  let report = `INCOME REPORT\n`;
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += `${"=".repeat(80)}\n\n`;

  const total = incomeRecords.reduce((s, r) => s + r.total, 0);
  report += `Total Income: KES ${total.toLocaleString()}\n`;
  report += `Total Records: ${incomeRecords.length}\n\n`;

  report += `BREAKDOWN BY SOURCE:\n`;
  report += `${"=".repeat(80)}\n`;

  const sources: Record<string, number> = {};
  incomeRecords.forEach(r => {
    sources[r.source] = (sources[r.source] || 0) + r.total;
  });

  Object.entries(sources)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .forEach(([source, amount]) => {
      const percentage = ((amount / total) * 100).toFixed(1);
      report += `${source}: KES ${(amount as number).toLocaleString()} (${percentage}%)\n`;
    });

  report += `\nDETAILED INCOME:\n`;
  report += `${"=".repeat(80)}\n`;
  report += `Date | Source | Quantity | Price/Unit | Total (KES)\n`;
  report += `${"-".repeat(80)}\n`;

  incomeRecords.forEach(r => {
    report += `${r.date} | ${r.source} | ${r.quantity} | ${r.price || "—"} | ${r.total.toLocaleString()}\n`;
  });

  return report;
};
