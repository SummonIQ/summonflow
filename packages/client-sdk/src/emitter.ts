import type { EventHandler, GlobalHandler } from "./types";

interface Binding {
  callback: EventHandler;
  context?: unknown;
}

interface GlobalBinding {
  callback: GlobalHandler;
  context?: unknown;
}

export class EventDispatcher {
  private readonly bindings = new Map<string, Binding[]>();
  private readonly globalBindings: GlobalBinding[] = [];

  bind(eventName: string, callback: EventHandler, context?: unknown): this {
    const list = this.bindings.get(eventName) ?? [];
    list.push({ callback, context });
    this.bindings.set(eventName, list);
    return this;
  }

  unbind(eventName?: string | null, callback?: EventHandler | null, context?: unknown): this {
    if (!eventName) {
      if (!callback && !context) {
        this.bindings.clear();
        return this;
      }

      for (const [name, bindings] of this.bindings.entries()) {
        this.bindings.set(
          name,
          bindings.filter((binding) => !matchesBinding(binding, callback, context)),
        );
      }

      return this;
    }

    const bindings = this.bindings.get(eventName);
    if (!bindings) {
      return this;
    }

    if (!callback && !context) {
      this.bindings.delete(eventName);
      return this;
    }

    this.bindings.set(
      eventName,
      bindings.filter((binding) => !matchesBinding(binding, callback, context)),
    );

    return this;
  }

  bind_global(callback: GlobalHandler, context?: unknown): this {
    this.globalBindings.push({ callback, context });
    return this;
  }

  unbind_global(callback?: GlobalHandler | null, context?: unknown): this {
    if (!callback && !context) {
      this.globalBindings.length = 0;
      return this;
    }

    for (let index = this.globalBindings.length - 1; index >= 0; index -= 1) {
      const binding = this.globalBindings[index];
      const callbackMatches = !callback || binding.callback === callback;
      const contextMatches = context === undefined || binding.context === context;
      if (callbackMatches && contextMatches) {
        this.globalBindings.splice(index, 1);
      }
    }

    return this;
  }

  unbind_all(): this {
    this.bindings.clear();
    this.globalBindings.length = 0;
    return this;
  }

  dispatch(eventName: string, data: unknown, metadata?: unknown): void {
    this.emit(eventName, data, metadata);
  }

  protected emit(eventName: string, data: unknown, metadata?: unknown): void {
    for (const binding of this.bindings.get(eventName) ?? []) {
      binding.callback.call(binding.context, data, metadata);
    }

    for (const binding of this.globalBindings) {
      binding.callback.call(binding.context, eventName, data);
    }
  }
}

function matchesBinding(
  binding: Binding,
  callback?: EventHandler | null,
  context?: unknown,
): boolean {
  const callbackMatches = !callback || binding.callback === callback;
  const contextMatches = context === undefined || binding.context === context;
  return callbackMatches && contextMatches;
}
