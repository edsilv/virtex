// base-component v1.0.1 https://github.com/edsilv/base-component#readme

declare var EventEmitter2: IEventEmitter2;
declare namespace Components {
    class BaseComponent implements IBaseComponent {
        options: IBaseComponentOptions;
        protected _$element: JQuery;
        constructor(options: IBaseComponentOptions);
        protected _init(): boolean;
        protected _getDefaultOptions(): IBaseComponentOptions;
        protected emitEvent(event: string, ...args: any[]): void;
        protected _resize(): void;
    }
}

declare namespace Components {
    class Events {
    }
}

declare namespace Components {
    interface IBaseComponent {
    }
}

declare namespace Components {
    interface IBaseComponentOptions {
        element?: string;
    }
}
