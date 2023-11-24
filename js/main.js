const axios = require('axios');
const { JSDOM } = require('jsdom');

async function main() {
  const wordpressUser = 'admin';
  const wordpressPassword = 'Lh5q jpYj nKy3 PNOw AjXP U7mn';
  const wordpressCredentials = `${wordpressUser}:${wordpressPassword}`;
  const wordpressToken = Buffer.from(wordpressCredentials).toString('base64');
  const wordpressHeader = { 'Authorization': `Basic ${wordpressToken}` };

  try {
    const response = await axios.get(
      'https://dev.htlweiz.at/wordpress/wp-json/wp/v2/posts/990',
      { headers: wordpressHeader }
    );

    const content = response.data;
    console.log(`${content.title.rendered}\n`);

    const dom = new JSDOM(content.content.rendered);
    const allText = dom.window.document.body.textContent.replace(/\s+/g, ' ').trim();
    console.log(allText);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  main();
}
