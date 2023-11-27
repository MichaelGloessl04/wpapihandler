const WPApiHandler = require('../wp-api-handler');


const wordpressUser = 'vue_js';
const wordpressPassword = 'rXhW lh6q wuuv d3C5 IKrX YMkI';
const wordpressCredentials = `${wordpressUser}:${wordpressPassword}`;
const wordpressToken = Buffer.from(wordpressCredentials).toString('base64');
const wordpressHeader = { 'Authorization': `Basic ${wordpressToken}` };

const test_post = {
  id: 9999,
  title: 'Your Event Title',
  start_date: '2023-11-24T10:00:00',
  end_date: '2023-11-24T12:00:00'
};


test('get by id', async () => {
    const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress',
                                 wordpressHeader);
    const hallo = await wpa.add_post(test_post);
    expect(await wpa.get_posts({id: 9999})).toBe(1);
  });
