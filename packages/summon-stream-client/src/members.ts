export class Members<TUserInfo = unknown> {
  count = 0;
  me: { id: string; info?: TUserInfo } | null = null;

  private readonly members = new Map<string, TUserInfo | undefined>();

  get(id: string): { id: string; info?: TUserInfo } | null {
    if (!this.members.has(id)) {
      return null;
    }

    return { id, info: this.members.get(id) };
  }

  each(callback: (member: { id: string; info?: TUserInfo }) => void): void {
    for (const [id, info] of this.members.entries()) {
      callback({ id, info });
    }
  }

  reset(): void {
    this.members.clear();
    this.count = 0;
    this.me = null;
  }

  hydrate(hash: Record<string, unknown> | undefined, ids: string[] | undefined, myId?: string): void {
    this.reset();
    const sourceIds = ids ?? Object.keys(hash ?? {});

    for (const id of sourceIds) {
      this.members.set(id, hash?.[id] as TUserInfo | undefined);
    }

    this.count = sourceIds.length;
    if (myId) {
      const me = this.get(myId);
      if (me) {
        this.me = me;
      }
    }
  }

  add(id: string, info?: TUserInfo): void {
    this.members.set(id, info);
    this.count = this.members.size;
  }

  remove(id: string): void {
    this.members.delete(id);
    if (this.me?.id === id) {
      this.me = null;
    }
    this.count = this.members.size;
  }
}
