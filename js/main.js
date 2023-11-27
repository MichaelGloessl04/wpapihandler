const WPApiHandler = require('./wp-api-handler');


async function main() {
  const wordpressUser = 'vue_js';
  const wordpressPassword = 'rXhW lh6q wuuv d3C5 IKrX YMkI';
  const wordpressCredentials = `${wordpressUser}:${wordpressPassword}`;
  const wordpressToken = Buffer.from(wordpressCredentials).toString('base64');
  const wordpressHeader = { 'Authorization': `Basic ${wordpressToken}` };
  const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);
  console.log(await wpa.get_events({amount: 10}));
}

if (require.main === module) {
  main();
}
