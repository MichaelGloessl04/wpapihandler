const WPApiHandler = require('./wp-api-handler')


async function main() {
  const wpa = WPApiHandler()
}

if (require.main === module) {
  main();
}
