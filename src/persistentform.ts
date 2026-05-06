/** Input types we treat as a single string `value` suitable for JSON round-trip. */
const PERSISTABLE_INPUT_TYPES = new Set([
  'text',
  'password',
  'search',
  'tel',
  'url',
  'email',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
  'number',
  'color',
  'hidden',
  'range',
])

function isPersistableValueControl(
  el: Element,
): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  if (el instanceof HTMLTextAreaElement && el.name) return true
  if (el instanceof HTMLSelectElement && el.name) return true
  if (el instanceof HTMLInputElement && el.name && PERSISTABLE_INPUT_TYPES.has(el.type)) {
    return true
  }
  return false
}

function isPersistableCheckbox(el: Element): el is HTMLInputElement {
  return el instanceof HTMLInputElement && el.type === 'checkbox' && Boolean(el.name)
}

/**
 * Restores string values from localStorage (JSON object) onto persistable form controls.
 */
export function loadFormFieldValuesFromLocalStorage(form: HTMLFormElement, storageKey: string): void {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return
    const data = JSON.parse(raw) as Record<string, unknown>
    for (const el of Array.from(form.elements)) {
      if (isPersistableCheckbox(el)) {
        const v = data[el.name]
        if (typeof v === 'boolean') {
          el.checked = v
        } else if (v === 'true') {
          el.checked = true
        } else if (v === 'false') {
          el.checked = false
        }
        continue
      }
      if (!isPersistableValueControl(el)) continue
      const v = data[el.name]
      if (typeof v !== 'string') continue
      el.value = v
    }
  } catch {
    /* ignore invalid or missing storage */
  }
}

/**
 * Persists persistable control values as a JSON object in localStorage.
 */
export function saveFormFieldValuesToLocalStorage(form: HTMLFormElement, storageKey: string): void {
  const data: Record<string, string | boolean> = {}
  for (const el of Array.from(form.elements)) {
    if (isPersistableCheckbox(el)) {
      data[el.name] = el.checked
      continue
    }
    if (!isPersistableValueControl(el)) continue
    data[el.name] = el.value
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
    /* quota, private mode, etc. */
  }
}

/** Loads saved values, then saves on every input or checkbox change. No-op if `form` is null. */
export function initPersistentForm(form: HTMLFormElement | null, storageKey: string): void {
  if (!form) return
  loadFormFieldValuesFromLocalStorage(form, storageKey)
  const save = () => saveFormFieldValuesToLocalStorage(form, storageKey)
  form.addEventListener('input', save)
  form.addEventListener('change', save)
}
