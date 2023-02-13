import { useCallback, useState } from 'react';
import NotificationSubscriber from './notification-subscriber';

type HandleSubscribeFuntion<T = unknown> = (subscription: PushSubscription) => Promise<T>;
type HandleUnsubscribeFuntion<T = unknown> = (subscription: PushSubscription) => Promise<T>;

export default function useNotificationSubscriber<THandleSubscribeFnResolve, THandleUnsubscribeFnResolve>(
	handleSubscribeFn: HandleSubscribeFuntion<THandleSubscribeFnResolve>,
	handleUnubscribeFn: HandleUnsubscribeFuntion<THandleUnsubscribeFnResolve>,
) {
	const [notifcationSubscriber] = useState(new NotificationSubscriber());

	const subscribe = useCallback(async () => {
		const subscription = await notifcationSubscriber.subscribe({
			userVisibleOnly: true,
			applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
		});

		return await handleSubscribeFn(subscription);
	}, [notifcationSubscriber, handleSubscribeFn]);

	const unsubscribe = useCallback(async () => {
		const subscription = await notifcationSubscriber.unsubscribe();
		return await handleUnubscribeFn(subscription);
	}, [notifcationSubscriber, handleUnubscribeFn]);

	return { subscribe, unsubscribe };
}
