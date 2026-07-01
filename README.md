# Groundcover + Grammarly freeze (repro)

Minimal React page that loads the **[Groundcover RUM](https://docs.groundcover.com/getting-started/installation-and-updating/connect-rum)** browser SDK next to a Mantine Rich Text Editor, to reproduce a **main-thread stall** when the **[Grammarly browser extension](https://chromewebstore.google.com/detail/kbfnbcaeplbcioakkpcpgfkobkghlhen)** is enabled and Groundcover **session recording** is on.

## Live demo

**https://isqua.github.io/groundcover-performance/**

## What goes wrong

With Grammarly installed and enabled, typing in the demo editor is fine **until** you start Groundcover recording. After **Start recording**, typing in the editor can **freeze the UI**.

If it does not reproduce on a fast machine, **CPU throttling** in Chrome DevTools (Performance panel) often makes it visible.

## How to reproduce

1. Install the [Grammarly browser extension](https://chromewebstore.google.com/detail/kbfnbcaeplbcioakkpcpgfkobkghlhen).

1. Take your **Groundcover API key** and **DSN** from Groundcover Admin Panel.

1. Open **https://isqua.github.io/groundcover-performance/** with Grammarly enabled.

1. Fill the **Groundcover configuration** form, for example:
   - **API key** — from the step above  
   - **Cluster** — any label you use for the environment
   - **Environment** — e.g. `development`
   - **DSN** — from the step above
   - **App ID** — any stable id for this demo (e.g. `groundcover-performance`)

1. Click **Initialize** and confirm the status shows **Initialized**.

1. Click **Start recording** and confirm status shows **Recording**.

1. Type in the **Demo rich text editor** — observe freezes / delayed input / non-blinking caret as described above

1. Optional: enable **CPU throttling** in DevTools → **Performance** (or **Rendering**), then repeat step 7.

## Tested versions

- Grammarly extension: 14.1289.0
- `@groundcover/browser`: 0.1.0

## Local development

```bash
npm ci
npm run dev
```

Build:

```bash
npm run build
```
