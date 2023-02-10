import cors from 'cors';
import express from 'express';
import Cache from 'node-cache';
import webpush from 'web-push';

const cache = new Cache();

const privateKey = '2mfiLtObgao4BA-WzD5hvkomjvXKGsGmKIw_EwzkCas';
const publicKey = 'BNgwCCpQ-Z3qej5plRP5c1J_UIgVyAJ1gc3HfRi94KV8WSRvrbq9SRutZgUnANucT3cs1yTqUd9MCUbDJpxeCgE';

webpush.setVapidDetails('http://localhost:3000', publicKey, privateKey);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/subscription', (req, res) => {
	const subscriptions = cache.keys().map((key) => cache.get(key));
	res.status(200).send(subscriptions);
});

app.post('/subscription', (req, res) => {
	const { subscription } = req.body;
	cache.set(subscription.endpoint, subscription);
	res.sendStatus(201);
});

app.post('/send', (req, res) => {
	const { message } = req.body;
	const subscriptions = cache.keys().map((key) => cache.get(key));
	const notifications = subscriptions.map((subscription) => webpush.sendNotification(subscription, message));
	Promise.allSettled(notifications);
	res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => console.log('Server is listen on port', PORT));
