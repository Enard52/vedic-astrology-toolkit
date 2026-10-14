// Main-thread client for the engine worker: one shared worker for the whole
// app, plus a React hook that runs an engine call and ignores stale results.
// SPDX-License-Identifier: AGPL-3.0-or-later
import { useEffect, useState, type DependencyList } from 'react'
import { wrap, type Remote } from 'comlink'
import type { EngineApi } from '@/engine/api'

export type Engine = Remote<EngineApi>

export const ENGINE_START_FAILED = 'The calculation engine could not start. Reload the page to try again.'

let engine: Promise<Engine> | null = null

async function start(): Promise<Engine> {
  const worker = new Worker(new URL('../worker/engine.worker.ts', import.meta.url), { type: 'module', name: 'engine' })
  // A worker that fails to load never answers Comlink, so surface its error event instead of hanging.
  const failed = new Promise<never>((_, reject) => {
    worker.addEventListener('error', (e) => reject(new Error(e.message || 'The engine worker failed to load')), { once: true })
  })
  const remote = wrap<EngineApi>(worker)
  try {
    await Promise.race([remote.init(), failed])
    return remote
  } catch (e) {
    worker.terminate()
    // The underlying error (a 404, "Aborted(CompileError ...)") means nothing to users; keep it as the cause.
    throw new Error(ENGINE_START_FAILED, { cause: e })
  }
}

/** The shared engine, initialised. A failed start is forgotten so the next call retries. */
export function getEngine(): Promise<Engine> {
  engine ??= start().catch((e: unknown) => {
    engine = null
    throw e
  })
  return engine
}

export interface EngineQuery<T> {
  /** Latest result; kept while a newer request is loading, cleared on error. */
  data: T | undefined
  error: Error | null
  loading: boolean
}

/**
 * Run `run` against the engine whenever `deps` change. Results of superseded
 * runs are discarded (the worker still finishes them, since it handles one call at a time).
 */
export function useEngineQuery<T>(run: (engine: Engine) => Promise<T>, deps: DependencyList): EngineQuery<T> {
  const [state, setState] = useState<EngineQuery<T>>({ data: undefined, error: null, loading: true })
  useEffect(() => {
    let current = true
    setState((s) => (s.loading ? s : { ...s, loading: true }))
    getEngine()
      .then(run)
      .then(
        (data) => current && setState({ data, error: null, loading: false }),
        (e: unknown) => current && setState({ data: undefined, error: e instanceof Error ? e : new Error(String(e)), loading: false }),
      )
    return () => {
      current = false
    }
    // `run` is recreated every render; callers list its inputs in `deps`, as with useEffect.
  }, deps)
  return state
}
