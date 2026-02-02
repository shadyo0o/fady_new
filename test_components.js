// Simple test to verify the components can be imported
try {
  const fs = require('fs');
  
  // Check if files exist
  const dashboardPage = fs.existsSync('f:\\جرافيتي\\fady-vaccines-web\\app\\dashboard\\page.js');
  const childPage = fs.existsSync('f:\\جرافيتي\\fady-vaccines-web\\app\\childs\\[id]\\page.js');
  const vaccinationTable = fs.existsSync('f:\\جرافيتي\\fady-vaccines-web\\components\\dashboard\\VaccinationTable.js');
  
  console.log('Files exist:');
  console.log('Dashboard page:', dashboardPage);
  console.log('Child page:', childPage);
  console.log('VaccinationTable component:', vaccinationTable);
  
  // Check file sizes
  if (dashboardPage) {
    const stats = fs.statSync('f:\\جرافيتي\\fady-vaccines-web\\app\\dashboard\\page.js');
    console.log('Dashboard page size:', stats.size, 'bytes');
  }
  
  if (childPage) {
    const stats = fs.statSync('f:\\جرافيتي\\fady-vaccines-web\\app\\childs\\[id]\\page.js');
    console.log('Child page size:', stats.size, 'bytes');
  }
  
  if (vaccinationTable) {
    const stats = fs.statSync('f:\\جرافيتي\\fady-vaccines-web\\components\\dashboard\\VaccinationTable.js');
    console.log('VaccinationTable size:', stats.size, 'bytes');
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
