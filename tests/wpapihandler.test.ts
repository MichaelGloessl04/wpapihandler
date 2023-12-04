import WPApiHandler from '../index';
import fs from 'fs';
import { HeaderError, InvalidURLError } from '../errors/errors';

describe('WPApiHandler', () => {
  it('should instantiate WPApiHandler with provided URL and headers from config file', () => {
    const configFile = 'tests/test-data/credentials.json';
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

    const wpa = new WPApiHandler(config.correct.URL, config.correct.headers);

    expect(wpa).toBeDefined();
  });

  it("should reject invalid URLs.", () => {
    const configFile = 'tests/test-data/credentials.json';
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  
    const invalidUrlWpa = new WPApiHandler(config.incorrect.URL, config.correct.headers);
    expect(() => invalidUrlWpa.check_connection()).rejects.toThrow(InvalidURLError);
  });

  it("should reject invalid login credentials.", () => {
    const configFile = 'tests/test-data/credentials.json';
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

    const wrongAuthHeadersWpa = new WPApiHandler(config.correct.URL, config.incorrect.headers);
    expect(() => wrongAuthHeadersWpa.check_connection()).rejects.toThrow(HeaderError);
  });
});