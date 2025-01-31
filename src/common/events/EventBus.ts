import { EventEmitter } from 'events';

export type EventHandler = (...args: any[]) => void;

export class EventBus {
	private static instance: EventBus;
	private eventEmitter: EventEmitter;

	private constructor() {
		this.eventEmitter = new EventEmitter();
		// Set a higher limit for event listeners
		this.eventEmitter.setMaxListeners(100);
	}

	public static getInstance(): EventBus {
		if (!EventBus.instance) {
			EventBus.instance = new EventBus();
		}
		return EventBus.instance;
	}

	public emit(eventName: string, data?: any): void {
		this.eventEmitter.emit(eventName, data);
	}

	public on(eventName: string, handler: EventHandler): void {
		this.eventEmitter.on(eventName, handler);
	}

	public off(eventName: string, handler: EventHandler): void {
		this.eventEmitter.off(eventName, handler);
	}

	public once(eventName: string, handler: EventHandler): void {
		this.eventEmitter.once(eventName, handler);
	}
}

// Define common system events
export const SystemEvents = {
	SERVER_STARTING: 'server:starting',
	SERVER_STARTED: 'server:started',
	SERVER_SHUTDOWN: 'server:shutdown',
	DATABASE_CONNECTED: 'database:connected',
	DATABASE_ERROR: 'database:error',
	REQUEST_TIMEOUT: 'request:timeout',
	UNHANDLED_ERROR: 'error:unhandled',
} as const;

export type SystemEventType = typeof SystemEvents[keyof typeof SystemEvents];