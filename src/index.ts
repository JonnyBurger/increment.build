import express from 'express';
import db from './db';

const app = express();

app.use(express.static('static'));

app.get('/:identifier', async (request, response) => {
	const {identifier} = request.params;
	const connection = await db();
	const channel = await connection.channel.findOne({
		identifier
	});
	if (!channel) {
		await connection.channel.insertOne({
			identifier,
			howManyTimesIncremented: 1,
			value: 1
		});
		response.end('1');
		return;
	}
	await connection.channel.updateOne(
		{
			identifier
		},
		{
			$set: {
				value: channel.value + 1,
				howManyTimesIncremented: channel.howManyTimesIncremented + 1
			}
		}
	);
	response.end(String(channel.value + 1));
});

app.get('/:identifier/set/:numberstr', async (request, response) => {
	const {identifier, numberstr} = request.params;
	const num = parseInt(numberstr);
	if (typeof num !== 'number' || isNaN(num)) {
		response
			.status(400)
			.end(
				'Must set to a number. Example: increment.build/my-awesome-app/set/1154'
			);
		return;
	}
	const connection = await db();
	const channel = await connection.channel.findOne({
		identifier
	});
	if (!channel) {
		await connection.channel.insertOne({
			identifier,
			howManyTimesIncremented: 1,
			value: num
		});
		return response.end(String(num));
	}
	if (num <= channel.value) {
		response
			.status(400)
			.end('You cannot decrease the number. Use another identifier instead.');
		return;
	}
	await connection.channel.updateOne(
		{
			identifier
		},
		{
			$set: {
				howManyTimesIncremented: channel.howManyTimesIncremented + 1,
				value: num
			}
		}
	);
	return response.end(String(num));
});

app.use(async (request, response) => {
	response
		.status(404)
		.end(
			'You cannot include a slash in your identifier.\nTry without one, for example increment.build/my-awesome-app'
		);
});

app.listen(process.env.PORT || 8000);
console.log('App started on port 8000');
