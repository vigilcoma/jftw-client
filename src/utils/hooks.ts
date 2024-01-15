export type CallbackFunction = (...args: any[]) => void;
export type RegisteredHook = {
    id: Symbol,
    callback: CallbackFunction
};

export class Hooks {
    protected hooks: Map<string, RegisteredHook[]> = new Map();
    protected hooksList: string[] = [];

    protected addHooksDescription(hooks: string[]) {
        this.hooksList = hooks;

        this.hooksList.forEach((hookName: string) => {
            this.hooks.set(hookName, []);
        })
    }

    protected callHook(hookName: string, ...args: any[]) {
        this.hooks.get(hookName)?.forEach((hookData: RegisteredHook) => {
            hookData.callback(...args);
        })
    }

    registerHook(hookName: string, hook: any): Symbol | null {
        if(this.hooksList.includes(hookName)) {
            const symbol = Symbol("hook");

            this.hooks.get(hookName)?.push({
                id: symbol,
                callback: hook
            });

            return symbol;
        }

        return null;
    }

    deleteHook(hookId: Symbol) {

    }
}