import mongodb, {MongoClient} from 'mongodb';

let _client: MongoClient | null = null;

type Channel = {
	identifier: string;
	value: number;
	howManyTimesIncremented: number;
};

type Database = {
	channel: mongodb.Collection<Channel>;
};

export const db = async (): Promise<Database> => {
	if (!_client || !_client.isConnected) {
		_client = await mongodb.connect(process.env.MONGO_URL as string, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		_client.db('incrementbuild').collection<Channel>('channel').createIndex({
			identifier: 1,
		});
	}
	return {
		channel: _client.db('incrementbuild').collection<Channel>('channel'),
	};
};
