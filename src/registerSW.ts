import { Workbox } from 'workbox-window';

async function subscribe(registration: ServiceWorkerRegistration | undefined) {
	let subscription = await registration?.pushManager.getSubscription();

	if (subscription === null) {
		subscription = await registration?.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey:
				'BNgwCCpQ-Z3qej5plRP5c1J_UIgVyAJ1gc3HfRi94KV8WSRvrbq9SRutZgUnANucT3cs1yTqUd9MCUbDJpxeCgE',
		});
	}

	return subscription;
}

async function sendSubscriptionToBackEnd(subscription: PushSubscription | undefined) {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/subscription`, {
		method: 'POST',
		body: JSON.stringify({ subscription }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Cannot save subscription');
	}

	console.log('Subscription saved');
}

if ('serviceWorker' in navigator) {
	const wb = new Workbox(import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw', {
		scope: import.meta.env.BASE_URL,
		type: import.meta.env.MODE === 'production' ? 'classic' : 'module',
	});

	wb.register().then(subscribe).then(sendSubscriptionToBackEnd);
}
