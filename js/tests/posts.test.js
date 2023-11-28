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
}, 10000);


test('get by amount', async () => {
	const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);

	const totalPosts = await wpa.len();
	const testkeys = [10, 100, 200, totalPosts, 99999];
	const testvalues = [10, 100, 200, totalPosts, totalPosts];

	testkeys.forEach(async (key, i) => {
    	expect(await wpa.get_posts({amount: key})).toBe(testvalues[i]);
  	});
}, 10000);
