const CalendarHandler = require('./calendar-handler');


async function main() {
  const payload = {
    id: 123,
    title: 'Your Event Title',
    start_date: '2023-11-24T10:00:00',
    end_date: '2023-11-24T12:00:00'
  };

  const wordpressUser = 'vue_js';
  const wordpressPassword = 'rXhW lh6q wuuv d3C5 IKrX YMkI';
  const wordpressCredentials = `${wordpressUser}:${wordpressPassword}`;
  const wordpressToken = Buffer.from(wordpressCredentials).toString('base64')
  const wordpressHeader = { 'Authorization': `Basic ${wordpressToken}` };

  const ch = new CalendarHandler('https://dev.htlweiz.at/wordpress/wp-json/tribe/events/v1/', wordpressHeader)
  test = await ch.get_events();
  test.forEach(element => {
    console.log([element.title, element.id]);
  });
  await ch.remove_event(1312);
}

if (require.main === module) {
  main();
}
