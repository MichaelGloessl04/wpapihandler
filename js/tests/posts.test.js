const WPApiHandler = require('../wp-api-handler');
const fs = require('fs');


const wordpressUser = 'vue_js';
const wordpressPassword = 'rXhW lh6q wuuv d3C5 IKrX YMkI';
const wordpressCredentials = `${wordpressUser}:${wordpressPassword}`;
const wordpressToken = Buffer.from(wordpressCredentials).toString('base64');
const wordpressHeader = { 'Authorization': `Basic ${wordpressToken}` };

const test_post = {
	title: 'test-post',
	content: 'This is a post meant for testing. :)'
};

function hasDuplicates(array) {
	const seen = new Set();
	for (const obj of array) {
	  	if (seen.has(obj.id)) {
			return true;
	  	}
	  	seen.add(obj.id);
	}
	return false;
}

test('get by id', async () => {
	const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);

	let jsonData;
	try {
		const data = await fs.promises.readFile('./tests/test-data.json', 'utf8');
		jsonData = JSON.parse(data);
	} catch (error) {
		console.error('Error reading or parsing JSON data:', error);
	}

	const post = await wpa.get_posts(1370);
	console.log(post);
	expect(post).toEqual(jsonData.get_data);
}, 10000);


test('get all', async () => {
	const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);
	totalPosts = await wpa.len();

	expect((await wpa.get_posts()).length).toEqual(totalPosts);
	expect(hasDuplicates(await wpa.get_posts())).toEqual(false);
}, 20000);


test('add post', async () => {
	const wpa = new WPApiHandler('https://dev.htlweiz.at/wordpress', wordpressHeader);
	response = await wpa.add_post(test_post);
	new_post = response.data;
	exist = await wpa.get_posts(response.data.id);
	expect(new_post.id).toEqual(exist.id);
}, 10000);
