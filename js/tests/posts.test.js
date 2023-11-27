const WPApiHandler = require('../wp-api-handler');
const fs = require('fs');


const wordpressUser = 'vue_js';
const wordpressPassword = 'rXhW lh6q wuuv d3C5 IKrX YMkI';
const wordpressCredentials = `${wordpressUser}:${wordpressPassword}`;
const wordpressToken = Buffer.from(wordpressCredentials).toString('base64');
const wordpressHeader = { 'Authorization': `Basic ${wordpressToken}` };

const test_post = {
  id: 9999,
  title: 'test-post'
};


test('get by id', async () => {
  const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress',
  wordpressHeader);
  fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    const jsonData = JSON.parse(data);
    data = await wpa.get_posts({id: 1327})[0];
    expect(data).toBe(jsonData['test-get']);
  });
});
