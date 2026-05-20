import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, type UseFormReturnType } from '@mantine/form'
import groundcover from '@groundcover/browser'

export type GroundcoverInitParams = NonNullable<Parameters<typeof groundcover.init>[0]>

export type GroundcoverFormValues = {
  apiKey: string
  cluster: string
  environment: string
  dsn: string
  appId: string
  rrIgnore: boolean
  rrBlock: boolean
  rrMask: boolean
}

export type GroundcoverReplayValues = Pick<GroundcoverFormValues, 'rrIgnore' | 'rrBlock' | 'rrMask'>
export type GroundcoverConfigFormState = UseFormReturnType<GroundcoverFormValues>

export type GroundcoverStatus =
  | { type: 'idle' }
  | { type: 'initialized' }
  | { type: 'recording' }
  | { type: 'stopped' }
  | { type: 'error'; message: string }

type UseGroundcoverConfigParams = {
  onInit: (payload: GroundcoverInitParams) => void
  onStartRecording: () => void
  onStopRecording: () => void
}

const GROUNDCOVER_DEMO_STORAGE_KEY = 'groundcover-demo'

const DEFAULT_FORM_VALUES: GroundcoverFormValues = {
  apiKey: '',
  cluster: '',
  environment: '',
  dsn: '',
  appId: '',
  rrIgnore: false,
  rrBlock: false,
  rrMask: false,
}

function readStoredFormValues(): GroundcoverFormValues {
  try {
    const raw = localStorage.getItem(GROUNDCOVER_DEMO_STORAGE_KEY)
    if (!raw) return DEFAULT_FORM_VALUES

    const data = JSON.parse(raw) as Record<string, unknown>
    return {
      apiKey: typeof data.apiKey === 'string' ? data.apiKey : '',
      cluster: typeof data.cluster === 'string' ? data.cluster : '',
      environment: typeof data.environment === 'string' ? data.environment : '',
      dsn: typeof data.dsn === 'string' ? data.dsn : '',
      appId: typeof data.appId === 'string' ? data.appId : '',
      rrIgnore: data.rrIgnore === true || data.rrIgnore === 'true',
      rrBlock: data.rrBlock === true || data.rrBlock === 'true',
      rrMask: data.rrMask === true || data.rrMask === 'true',
    }
  } catch {
    return DEFAULT_FORM_VALUES
  }
}

function persistFormValues(values: GroundcoverFormValues): void {
  try {
    localStorage.setItem(GROUNDCOVER_DEMO_STORAGE_KEY, JSON.stringify(values))
  } catch {
    /* Ignore localStorage quota/private mode errors. */
  }
}

function trimValue(value: string): string {
  return value.trim()
}

export function buildInitPayload(values: GroundcoverFormValues): GroundcoverInitParams {
  return {
    apiKey: trimValue(values.apiKey),
    appId: trimValue(values.appId),
    dsn: trimValue(values.dsn),
    environment: trimValue(values.environment),
    cluster: trimValue(values.cluster),
    options: {
      enabledEvents: [],
    },
  }
}

export function getReplayValues(values: GroundcoverFormValues): GroundcoverReplayValues {
  return {
    rrIgnore: values.rrIgnore,
    rrBlock: values.rrBlock,
    rrMask: values.rrMask,
  }
}

function getReplayClassName(values: GroundcoverReplayValues): string {
  return [
    'demo-editor__prosemirror',
    values.rrIgnore ? 'rr-ignore' : '',
    values.rrBlock ? 'rr-block' : '',
    values.rrMask ? 'rr-mask' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function useGroundcoverConfig({
  onInit,
  onStartRecording,
  onStopRecording,
}: UseGroundcoverConfigParams) {
  const form = useForm<GroundcoverFormValues>({
    initialValues: readStoredFormValues(),
  })
  const [status, setStatus] = useState<GroundcoverStatus>({ type: 'idle' })

  useEffect(() => {
    persistFormValues(form.values)
  }, [form.values])

  const replayClassName = useMemo(
    () => getReplayClassName(getReplayValues(form.values)),
    [form.values],
  )

  const handleInitialize = useCallback(() => {
    setStatus({ type: 'idle' })
    const payload = buildInitPayload(form.getValues())

    try {
      onInit(payload)
      setStatus({ type: 'initialized' })
    } catch (e) {
      setStatus({
        type: 'error',
        message: e instanceof Error ? e.message : 'Initialize failed',
      })
    }
  }, [form, onInit])

  const handleStartRecording = useCallback(() => {
    onStartRecording()
    setStatus({ type: 'recording' })
  }, [onStartRecording])

  const handleStopRecording = useCallback(() => {
    onStopRecording()
    setStatus({ type: 'stopped' })
  }, [onStopRecording])

  return {
    form,
    status,
    replayClassName,
    handleInitialize,
    handleStartRecording,
    handleStopRecording,
  }
}
