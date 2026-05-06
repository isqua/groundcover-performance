import './style.css'
import { setupGroundcoverDemo } from './groundcover'
import { initPersistentForm } from './persistentform'

const GROUNDCOVER_DEMO_FORM_NAME = 'groundcoverDemo' as const

const GROUNDCOVER_DEMO_STORAGE_KEY = 'groundcover-demo' as const

const demoForm = document.forms.namedItem(GROUNDCOVER_DEMO_FORM_NAME)
const groundcoverDemoForm = demoForm instanceof HTMLFormElement ? demoForm : null

initPersistentForm(groundcoverDemoForm, GROUNDCOVER_DEMO_STORAGE_KEY)
setupGroundcoverDemo(groundcoverDemoForm)
