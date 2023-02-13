export default class NotificationSubscriber {
	private async getRegistration(): Promise<ServiceWorkerRegistration> | never {
		const registration = await navigator.serviceWorker.getRegistration();

		if (!registration) {
			throw new Error('Cannot access to service worker registration');
		}

		return registration;
	}

	async subscribe(options?: PushSubscriptionOptionsInit): Promise<PushSubscription> | never {
		const registration = await this.getRegistration();

		let subscription = await registration.pushManager.getSubscription();

		if (!subscription) {
			subscription = await registration.pushManager.subscribe(options);
		}

		return subscription;
	}

	async unsubscribe(): Promise<PushSubscription> | never {
		const registration = await this.getRegistration();

		let subscription = await registration.pushManager.getSubscription();

		if (!subscription) {
			throw new Error('No subscription yet');
		}

		await subscription.unsubscribe();

		return subscription;
	}
}
