import groundcover from '@groundcover/browser'
import { getNamedStringControl, trimValue } from './utils'

type InitParams = Parameters<typeof groundcover.init>[0];

function getFormFieldValue(form: HTMLFormElement, name: string): string {
  return trimValue(getNamedStringControl(form, name)) ?? '';
}

function setStatus(el: HTMLOutputElement | null, message: string, kind: 'error' | 'success' | '') {
  if (!el) return
  el.value = message
  el.dataset.kind = kind
}

function buildInitPayload(form: HTMLFormElement): InitParams {
  const payload: InitParams = {
    apiKey: getFormFieldValue(form, 'apiKey'),
    appId: getFormFieldValue(form, 'appId'),
    dsn: getFormFieldValue(form, 'dsn'),
    environment: getFormFieldValue(form, 'environment'),
    cluster: getFormFieldValue(form, 'cluster'),
  };

  return payload
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
    const payload = buildInitPayload(form);

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
