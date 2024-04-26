// database.js
const fs = require('fs');
const path = require('path');

// Path to the data.json file
const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from data.json file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return null;
  }
}

// Function to write data to data.json file
function writeDataToFile(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
}

module.exports = {
  readDataFromFile,
  writeDataToFile
};
