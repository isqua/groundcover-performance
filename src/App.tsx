import { Box, Container, MantineProvider, Stack, Title } from '@mantine/core'
import groundcover from '@groundcover/browser'
import { DemoRichTextEditor } from './DemoRichTextEditor'
import { Footer } from './Footer'
import { GroundcoverConfigForm } from './GroundcoverConfigForm'
import { useGroundcoverConfig } from './useGroundcoverConfig'

function GroundcoverDemo() {
  const groundcoverConfig = useGroundcoverConfig({
    onInit: (payload) => {
      groundcover.init(payload)
      console.log('Initialized with options:', payload.options ?? 'No options')
    },
    onStartRecording: () => {
      groundcover.startReplayRecording()
      console.log('Started recording')
    },
    onStopRecording: () => {
      groundcover.stopReplayRecording()
      console.log('Stopped recording')
    },
  })

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <GroundcoverConfigForm
          form={groundcoverConfig.form}
          status={groundcoverConfig.status}
          onInitialize={groundcoverConfig.handleInitialize}
          onStartRecording={groundcoverConfig.handleStartRecording}
          onStopRecording={groundcoverConfig.handleStopRecording}
        />

        <Box component="section" aria-labelledby="demo-editor-heading">
          <Title id="demo-editor-heading" order={2} mb="md">
            Demo rich text editor
          </Title>
          <DemoRichTextEditor replayClassName={groundcoverConfig.replayClassName} />
        </Box>

        <Footer />
      </Stack>
    </Container>
  )
}

export function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <GroundcoverDemo />
    </MantineProvider>
  )
}
