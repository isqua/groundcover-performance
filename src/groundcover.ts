import groundcover from '@groundcover/browser'
import { getNamedStringControl, trimValue } from './utils'

type InitParams = NonNullable<Parameters<typeof groundcover.init>[0]>

const DEMO_FIELD_NAMES = ['apiKey', 'appId', 'dsn', 'environment', 'cluster'] as const

type DemoFieldName = (typeof DEMO_FIELD_NAMES)[number]

function setStatus(el: HTMLOutputElement | null, message: string, kind: 'error' | 'success' | '') {
  if (!el) return
  el.value = message
  el.dataset.kind = kind
}

function buildInitPayload(form: HTMLFormElement): { payload: InitParams; error: string | null } {
  const payload = {} as InitParams

  for (const key of DEMO_FIELD_NAMES) {
    const v = trimValue(getNamedStringControl(form, key))
    if (v === undefined) {
      return {
        payload,
        error: `Missing required field: ${key}.`,
      }
    }
    ; (payload as Record<DemoFieldName, string>)[key] = v
  }

  return { payload, error: null }
}

export function setupGroundcoverDemo(form: HTMLFormElement | null) {
  if (!form) return

  const statusEl = form.elements.namedItem('status')
  const status = statusEl instanceof HTMLOutputElement ? statusEl : null

  const initEl = form.elements.namedItem('initialize')
  const btnInit = initEl instanceof HTMLButtonElement ? initEl : null

  const replayStartEl = form.elements.namedItem('replayStart')
  const btnReplayStart = replayStartEl instanceof HTMLButtonElement ? replayStartEl : null

  const replayStopEl = form.elements.namedItem('replayStop')
  const btnReplayStop = replayStopEl instanceof HTMLButtonElement ? replayStopEl : null

  if (!btnInit || !btnReplayStart || !btnReplayStop) return

  let initialized = false

  const syncReplayButtons = () => {
    btnReplayStart.disabled = !initialized
    btnReplayStop.disabled = !initialized
  }

  syncReplayButtons()

  btnInit.addEventListener('click', () => {
    setStatus(status, '', '')
    const { payload, error } = buildInitPayload(form)
    if (error) {
      setStatus(status, error, 'error')
      return
    }
    try {
      groundcover.init(payload)
      initialized = true
      syncReplayButtons()
      setStatus(status, 'Initialized.', 'success')
    } catch (e) {
      setStatus(status, e instanceof Error ? e.message : 'Initialize failed.', 'error')
    }
  })

  btnReplayStart.addEventListener('click', () => {
    setStatus(status, '', '')
    groundcover.startReplayRecording()
    setStatus(status, '⏺ Recording', 'success')
  })

  btnReplayStop.addEventListener('click', () => {
    setStatus(status, '', '')
    groundcover.stopReplayRecording()
    setStatus(status, 'Recording stopped', 'success')
  })
}
