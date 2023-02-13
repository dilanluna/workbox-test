import { useCallback, useMemo } from 'react';

export default function useRequestNotificationsPermission() {
	const permission = useMemo(() => Notification.permission, []);
	const requestPermission = useCallback(() => {
		return Notification.requestPermission();
	}, []);

	return { permission, requestPermission };
}
