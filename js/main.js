const PostHandler = require('./post-handler');


async function main() {
  const payload = {
    title: 'Your Event Title',
    date: '2023-11-24T10:00:00',
    content: 'Test'
  };

  const wordpressUser = 'vue_js';
  const wordpressPassword = 'rXhW lh6q wuuv d3C5 IKrX YMkI';
  const wordpressCredentials = `${wordpressUser}:${wordpressPassword}`;
  const wordpressToken = Buffer.from(wordpressCredentials).toString('base64');
  const wordpressHeader = { 'Authorization': `Basic ${wordpressToken}` };

  const ph = new PostHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);
}

if (require.main === module) {
  main();
}
