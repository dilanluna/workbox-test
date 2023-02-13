import { ChangeEventHandler, useState } from 'react';
import useNotificationSubscriber from './use-notification-subscriber';
import useRequestNotificationsPermission from './use-request-notifications-permission';

async function sendSubscriptionToBackEnd(subscription: PushSubscription) {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/subscription`, {
		method: 'POST',
		body: JSON.stringify({ subscription }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Cannot register subscription');
	}

	console.log('Subscription registered');
}

async function removeSubscriptionFromBackEnd(subscription: PushSubscription) {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/subscription`, {
		method: 'DELETE',
		body: JSON.stringify({ subscription }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Cannot cancel subscription');
	}

	console.log('Subscription canceled');
}

export default function App() {
	const [showBackdrop, setShowBackdrop] = useState(false);
	const { permission, requestPermission } = useRequestNotificationsPermission();
	const { subscribe, unsubscribe } = useNotificationSubscriber(
		sendSubscriptionToBackEnd,
		removeSubscriptionFromBackEnd,
	);

	const handleEnableNotifications: ChangeEventHandler<HTMLInputElement> = async (e) => {
		const enableNotifications = e.target.checked;

		if (enableNotifications) {
			if (permission === 'default') {
				setShowBackdrop(true);
				try {
					const permission = await requestPermission();
					console.log(permission);
					// await subscribe();
				} finally {
					setShowBackdrop(false);
				}
			}
		} else {
			await unsubscribe();
		}
	};

	return (
		<div className="p-4">
			<h4 className="font-medium mb-4">Notifications</h4>

			<div className="flex items-center mb-4">
				<input
					type="checkbox"
					id="enable-notifications"
					onChange={handleEnableNotifications}
					className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
				/>
				<label
					htmlFor="enable-notifications"
					className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
					I want to receive notifications from the {import.meta.env.VITE_TITLE} web app.
				</label>
			</div>

			<p className="mb-4">If this option is deselected, I understand I won't be notified when:</p>

			<ul></ul>

			<div
				role="alert"
				className="flex p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800">
				<svg
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					className="flex-shrink-0 inline w-5 h-5 mr-3">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					/>
				</svg>
				<span className="sr-only">Info</span>
				<div>
					<span className="font-medium">Note:</span> Notifications are activated per device. To receive
					notifications on multiple devices, sign in on each device, enable notifications, an make sure you
					are online. However, turning off notifications on one device will turn them off on all devices.
				</div>
			</div>

			{showBackdrop ? (
				<div className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40" />
			) : null}
		</div>
	);
}
