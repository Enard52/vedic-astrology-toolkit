export interface SwissEphModule {
  _malloc(bytes: number): number
  _free(ptr: number): void
  cwrap(name: string, returnType: string | null, argTypes: string[]): (...args: number[]) => number
  UTF8ToString(ptr: number): string
  HEAPF64: Float64Array
  HEAP32: Int32Array
}
export interface SwissEphOptions {
  wasmBinary?: ArrayBuffer | Uint8Array
  locateFile?: (path: string, prefix: string) => string
}
export default function createSwissEph(options?: SwissEphOptions): Promise<SwissEphModule>
