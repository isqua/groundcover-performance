import './style.css'
import { setupGroundcoverDemo } from './groundcover'
import { initPersistentForm } from './persistentform'

const GROUNDCOVER_DEMO_FORM_NAME = 'groundcoverDemo' as const

const GROUNDCOVER_DEMO_STORAGE_KEY = 'groundcover-demo' as const

const RR_CLASS_TOGGLES: readonly { name: string; className: string }[] = [
  { name: 'rrIgnore', className: 'rr-ignore' },
  { name: 'rrBlock', className: 'rr-block' },
  { name: 'rrMask', className: 'rr-mask' },
]

function syncSessionReplayClassesFromForm(form: HTMLFormElement): void {
  const textarea = document.querySelector<HTMLTextAreaElement>('textarea[name="textarea"]')
  if (!textarea) return
  for (const { name, className } of RR_CLASS_TOGGLES) {
    const el = form.elements.namedItem(name)
    const cb = el instanceof HTMLInputElement && el.type === 'checkbox' ? el : null
    textarea.classList.toggle(className, Boolean(cb?.checked))
  }
}

function initSessionReplayClassToggles(form: HTMLFormElement | null): void {
  if (!form) return
  const onToggle = () => syncSessionReplayClassesFromForm(form)
  onToggle()
  form.addEventListener('change', (e) => {
    const t = e.target
    if (t instanceof HTMLInputElement && t.type === 'checkbox' && RR_CLASS_TOGGLES.some((x) => x.name === t.name)) {
      onToggle()
    }
  })
}

const demoForm = document.forms.namedItem(GROUNDCOVER_DEMO_FORM_NAME)
const groundcoverDemoForm = demoForm instanceof HTMLFormElement ? demoForm : null

initPersistentForm(groundcoverDemoForm, GROUNDCOVER_DEMO_STORAGE_KEY)
initSessionReplayClassToggles(groundcoverDemoForm)
setupGroundcoverDemo(groundcoverDemoForm)
