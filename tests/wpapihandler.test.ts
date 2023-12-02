import WPApiHandler from "../dist";
import * as fs from 'fs';


test('wpapihandler constructor', () => {
    fs.readFile('tests/test-data/credentials.json', 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return;
      }
      try {
        const parsedData = JSON.parse(data);
        const wpa = new WPApiHandler(parsedData.URL, parsedData.headers);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
      }
    });
  });