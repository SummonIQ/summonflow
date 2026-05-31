import { EventDispatcher } from "./emitter";
import { Members } from "./members";
import type {
  ChannelTriggerMetadata,
  EncryptedChannelPayload,
  PresenceChannelData,
  PresenceChannelMemberInfo,
} from "./types";
import type { SummonFlow } from "./index";

export class Channel extends EventDispatcher {
  subscribed = false;
  subscriptionPending = false;

  constructor(
    readonly name: string,
    protected readonly client: SummonFlow,
  ) {
    super();
  }

  isPrivate(): boolean {
    return (
      this.name.startsWith("private-") ||
      this.name.startsWith("presence-") ||
      this.name.startsWith("private-encrypted-")
    );
  }

  isPresence(): boolean {
    return this.name.startsWith("presence-");
  }

  isEncrypted(): boolean {
    return this.name.startsWith("private-encrypted-");
  }

  async subscribe(): Promise<void> {
    this.subscriptionPending = true;
    await this.client.subscribeChannel(this);
  }

  unsubscribe(): void {
    this.subscribed = false;
    this.subscriptionPending = false;
  }

  trigger(eventName: string, data: unknown): boolean {
    if (!this.isPrivate()) {
      throw new Error("Client events are only supported on private and presence channels.");
    }

    if (!eventName.startsWith("client-")) {
      throw new Error("Client events must start with \"client-\".");
    }

    this.client.sendEvent({
      event: eventName,
      channel: this.name,
      data,
    });
    return true;
  }

  handleSubscriptionSucceeded(data: unknown): void {
    this.subscriptionPending = false;
    this.subscribed = true;
    this.emitOnChannel("summon:subscription_succeeded", data);
  }

  handleEvent(eventName: string, data: unknown, metadata?: ChannelTriggerMetadata): void | Promise<void> {
    this.emitOnChannel(eventName, data, metadata);
  }

  private emitOnChannel(eventName: string, data: unknown, metadata?: ChannelTriggerMetadata): void {
    this.emit(eventName, data, metadata);
    this.client.emitGlobal(eventName, data);
  }
}

export class PresenceChannel<TUserInfo = unknown> extends Channel {
  readonly members = new Members<TUserInfo>();

  override handleSubscriptionSucceeded(data: unknown): void {
    const payload = data as PresenceChannelData | undefined;
    const presence = payload?.presence;
    this.members.hydrate(
      presence?.hash as Record<string, unknown> | undefined,
      presence?.ids,
      this.client.userId ?? undefined,
    );
    super.handleSubscriptionSucceeded(data);
  }

  override handleEvent(
    eventName: string,
    data: unknown,
    metadata?: ChannelTriggerMetadata,
  ): void | Promise<void> {
    if (eventName === "summon:member_added") {
      const member = data as PresenceChannelMemberInfo;
      this.members.add(member.memberId, member.memberInfo as TUserInfo | undefined);
    }

    if (eventName === "summon:member_removed") {
      const member = data as PresenceChannelMemberInfo;
      this.members.remove(member.memberId);
    }

    super.handleEvent(eventName, data, metadata);
  }
}

export class EncryptedChannel extends Channel {
  private sharedSecret: Uint8Array | null = null;

  override trigger(): boolean {
    throw new Error("Client events are not supported on private-encrypted channels.");
  }

  setSharedSecret(sharedSecretBase64: string): void {
    this.sharedSecret = decodeBase64(sharedSecretBase64);
  }

  override async handleEvent(
    eventName: string,
    data: unknown,
    metadata?: ChannelTriggerMetadata,
  ): Promise<void> {
    if (eventName.startsWith("summon_internal:") || eventName.startsWith("summon:")) {
      super.handleEvent(eventName, data, metadata);
      return;
    }

    if (!this.sharedSecret) {
      throw new Error(`Missing shared secret for encrypted channel ${this.name}`);
    }

    const decrypted = await decryptPayload(data as EncryptedChannelPayload, this.sharedSecret);
    super.handleEvent(eventName, decrypted, metadata);
  }
}

async function decryptPayload(payload: EncryptedChannelPayload, keyBytes: Uint8Array): Promise<unknown> {
  const cryptoImpl = resolveCrypto();
  const key = await cryptoImpl.subtle.importKey(
    "raw",
    toArrayBuffer(keyBytes),
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );
  const plaintext = await cryptoImpl.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(decodeBase64(payload.nonce)),
    },
    key,
    toArrayBuffer(decodeBase64(payload.ciphertext)),
  );

  return JSON.parse(new TextDecoder().decode(plaintext));
}

function decodeBase64(input: string): Uint8Array {
  if (typeof atob === "function") {
    const decoded = atob(input);
    return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
  }

  return Uint8Array.from(Buffer.from(input, "base64"));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function resolveCrypto(): Crypto {
  if (globalThis.crypto?.subtle) {
    return globalThis.crypto;
  }

  throw new Error("Web Crypto API is required for encrypted channels.");
}
