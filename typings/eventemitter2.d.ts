
interface EventEmitter2Configuration {
    delimiter?: string;
    maxListeners?: number;
    wildcard?: string;
    newListener?: Function;
}

interface IEventEmitter2 {
    constructor(conf?: EventEmitter2Configuration);
    addListener(event: string, listener: Function): IEventEmitter2;
    on(event: string, listener: Function): IEventEmitter2;
    onAny(listener: Function): IEventEmitter2;
    offAny(listener: Function): IEventEmitter2;
    once(event: string, listener: Function): IEventEmitter2;
    many(event: string, timesToListen: number, listener: Function): IEventEmitter2;
    removeListener(event: string, listener: Function): IEventEmitter2;
    off(event: string, listener: Function): IEventEmitter2;
    removeAllListeners(event?: string): IEventEmitter2;
    setMaxListeners(n: number): void;
    listeners(event: string): Function[];
    listenersAny(): Function[];
    emit(event: string, ...args: any[]);
}