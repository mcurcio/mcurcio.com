const PREFIX = '/affiliate/amazon/';
const TAG = 'mcurcio-20';

module.exports.handler = async function(event, context) {
	console.log("event", event)

	if (!event.path.startsWith(PREFIX)) {
		return {
			statusCode: 404
		};
	}

	const ASIN = event.path.substr(PREFIX.length);
	console.log('ASIN', ASIN);

	return {
		statusCode: 302,
		headers: {
			Location: `https://www.amazon.com/dp/${ASIN}/?tag=${TAG}`,
		}
	};
};
