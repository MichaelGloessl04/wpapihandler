import WPApiHandler from "../index";
import * as fs from 'fs';


test('wpapihandler constructor', () => {
  let url: string;
  let header: string;
  try {
    fs.readFile('tests/test-data/credentials.json', 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return err;
      }
      try {
        const parsedData = JSON.parse(data);
        url = 102;
        header = parsedData.headers;
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return parseError;
      }
    });
  } catch (parseError) {
    expect(0).toBe(1);
  }
});