/**
 * Nexachain Utility - Export Data to CSV
 * Handles clean CSV formatting, escaping, and automatic browser download.
 */
export function exportToCSV(filename, rows, headers) {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  // Generate header row
  const headerKeys = Object.keys(headers);
  const headerLabels = Object.values(headers);
  const csvContent = [];

  csvContent.push(headerLabels.map(label => `"${label.replace(/"/g, '""')}"`).join(','));

  // Generate data rows
  rows.forEach(row => {
    const rowValues = headerKeys.map(key => {
      let val = row[key];
      if (val === null || val === undefined) {
        val = '';
      } else if (typeof val === 'object') {
        val = JSON.stringify(val);
      } else {
        val = String(val);
      }
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvContent.push(rowValues.join(','));
  });

  // Create Blob and trigger download
  const blob = new Blob([csvContent.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
