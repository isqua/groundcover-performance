export type StringValueFormControl = HTMLInputElement | HTMLTextAreaElement

export type FormValueControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

/** Input, textarea, or select with a string `value` (not e.g. a `RadioNodeList`). */
export function getNamedFormValueControl(
  form: HTMLFormElement,
  name: string,
): FormValueControl | null {
  const el = form.elements.namedItem(name)
  if (el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    return el
  }
  if (el instanceof HTMLInputElement) {
    return el
  }
  return null
}

export function getNamedStringControl(
  form: HTMLFormElement,
  name: string,
): StringValueFormControl | null {
  const el = getNamedFormValueControl(form, name)
  if (el instanceof HTMLSelectElement) return null
  return el
}

export function trimValue(control: StringValueFormControl | null): string | undefined {
  if (!control) return undefined
  const v = control.value.trim()
  return v === '' ? undefined : v
}
