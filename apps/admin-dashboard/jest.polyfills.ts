import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';
import 'whatwg-fetch';

class BroadcastChannelMock {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
}

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  ReadableStream,
  TransformStream,
  WritableStream,
  BroadcastChannel: BroadcastChannelMock,
});
