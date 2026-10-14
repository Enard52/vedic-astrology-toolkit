// The engine's public surface. The UI reaches it through a Web Worker
// (src/worker/engine.worker.ts, src/lib/engine.ts); tests call it directly.
// To extend it, add a property to engineApi: Comlink then exposes it with a
// Promise-returning signature automatically. Arguments and results must be
// structured-clone friendly (plain objects, arrays, strings, numbers): no
// functions or class instances, and thrown errors keep only name and message.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { castChart, validateBirthInput } from './chart'
import { initSwe, swe } from './swe'

export interface EngineInitOptions {
  /** Where to fetch swisseph.wasm; the worker passes the bundled asset URL. Node finds the file itself. */
  wasmUrl?: string
}

export interface EngineVersion {
  /** Increment when a change alters computed results, so stored results can be invalidated. */
  engine: number
  /** Swiss Ephemeris library version, e.g. "2.10.03". */
  swisseph: string
}

export const ENGINE_VERSION = 1

export const engineApi = {
  /** Load Swiss Ephemeris once; repeated calls share the first load. */
  async init(options: EngineInitOptions = {}): Promise<EngineVersion> {
    const { wasmUrl } = options
    await initSwe(wasmUrl ? { locateFile: () => wasmUrl } : {})
    return engineApi.version()
  },
  /** Requires init(). */
  version(): EngineVersion {
    return { engine: ENGINE_VERSION, swisseph: swe().version() }
  },
  /** Field-level problems with a birth input (empty when valid); works before init(). */
  validateBirthInput,
  /** Natal chart; throws an Error named "BirthInputError" for invalid input. */
  castChart,
}

export type EngineApi = typeof engineApi
