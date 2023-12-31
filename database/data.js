const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

const parentDirectory = path.join(__dirname, '..');
dotenv.config({ path: path.join(parentDirectory, '.env') });

const dataFileName = process.env.JSON_FILE;
const directoryPath = './'; // Specify the directory path you want to search in

async function getMoviesData() {
  try {
    const files = await fs.readdir(directoryPath);
    const jsonDataFiles = files.filter(file => file === dataFileName);

    if (jsonDataFiles.length > 0) {
      const filePath = path.join(directoryPath, jsonDataFiles[0]);
      const data = await fs.readFile(filePath, 'utf8');
      const jsonObject = JSON.parse(data);
      console.log("get data success")
      return jsonObject;
    } else {
      console.log('No data.json file found in the directory:', directoryPath);
      throw new Error('No data.json file found');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = getMoviesData;
