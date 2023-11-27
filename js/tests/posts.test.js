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

  const post = await wpa.get_posts({ id: 1327 });
  console.log(post);
  expect(post[0]).toEqual(jsonData.get_data);
});


test('get by amount', async () => {
  const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);

  // Get the total number of posts
  const totalPosts = await wpa.len()[0];
  console.log('Total Posts:', totalPosts);

  // Define test cases as key-value pairs (amount: expected result)
  const testCases = {
    10: 10,
    100: 100,
    200: 200,
    [totalPosts]: totalPosts,
    99999: totalPosts // Assuming totalPosts is the maximum available posts
  };

  // Iterate through the test cases
  for (const [amount, expected] of Object.entries(testCases)) {
    console.log(`Testing for amount: ${amount}`);

    // Fetch posts
    const posts = await wpa.get_posts({ amount });

    // Check if the number of fetched posts matches the expected amount
    expect(posts.length).toEqual(Math.min(amount, expected));
  }
}, 10000);
