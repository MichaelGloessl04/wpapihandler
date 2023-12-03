import WPApiHandler from '../index';
import fs from 'fs';

describe('WPApiHandler', () => {
  it('should instantiate WPApiHandler with provided URL and headers from config file', () => {
    const configFile = 'tests/test-data/credentials.json';
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

    const wpa = new WPApiHandler(config.URL, config.headers);

    expect(wpa).toBeDefined();
  });
});
