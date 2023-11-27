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
  const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);

  let jsonData;
  try {
    const data = await fs.promises.readFile('./tests/test-data.json', 'utf8');
    jsonData = JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing JSON data:', error);
  }

  const posts = await wpa.get_posts({ id: 1327 });
  console.log(posts);
  expect(posts[0]).toEqual(jsonData.get_data);
});


test('get by amount', async () => {
  const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);
});
