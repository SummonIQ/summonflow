import { EventDispatcher } from "./emitter";
import type { ConnectionState, ConnectionStateChange } from "./types";

export class Connection extends EventDispatcher {
  state: ConnectionState = "initialized";
  socketId: string | null = null;

  setState(nextState: ConnectionState): void {
    if (this.state === nextState) {
      return;
    }

    const previous = this.state;
    this.state = nextState;
    this.emit("state_change", {
      previous,
      current: nextState,
    } satisfies ConnectionStateChange);
    this.emit(nextState, undefined);
  }
}
