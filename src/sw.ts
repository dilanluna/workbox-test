import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
	if (event.data === null) {
		return;
	}

	const message = event.data.text();
	event.waitUntil(
		self.registration.showNotification('Notification', {
			body: message,
		}),
	);
});
