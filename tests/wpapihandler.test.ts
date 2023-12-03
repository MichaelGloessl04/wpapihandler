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

  it("should check if it can make api requests", async () => {
    const configFile = 'tests/test-data/credentials.json';
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

    const validWpa = new WPApiHandler(config.correct.URL, config.correct.headers);
    await expect(validWpa.check_connection()).resolves.not.toThrow();

    const wrongAuthHeadersWpa = new WPApiHandler(config.correct.URL, config.incorrect.headers);
    await expect(() => wrongAuthHeadersWpa.check_connection()).rejects.toEqual(HeaderError);

    const invalidUrlWpa = new WPApiHandler(config.incorrect.URL, config.correct.headers);
    await expect(() => invalidUrlWpa.check_connection()).rejects.toEqual('Invalid username or password.');
  }, 30000);
});