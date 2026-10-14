import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { initSwe } from '@/engine/swe'

/** Initialise the WebAssembly engine inside Vitest (Node). */
export function loadSwe() {
  const wasm = readFileSync(fileURLToPath(new URL('../../wasm/swisseph.wasm', import.meta.url)))
  return initSwe({ wasmBinary: wasm })
}
