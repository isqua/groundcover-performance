import {
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import {
  type GroundcoverConfigFormState,
  type GroundcoverStatus,
} from './useGroundcoverConfig'

type GroundcoverConfigFormProps = {
  form: GroundcoverConfigFormState
  status: GroundcoverStatus
  onInitialize: () => void
  onStartRecording: () => void
  onStopRecording: () => void
}

function getStatusBadge(status: GroundcoverStatus): { message: string; color: string } | null {
  switch (status.type) {
    case 'idle':
      return null
    case 'initialized':
      return { message: 'Initialized', color: 'green' }
    case 'recording':
      return { message: 'Recording', color: 'green' }
    case 'stopped':
      return { message: 'Recording stopped', color: 'green' }
    case 'error':
      return { message: status.message, color: 'red' }
  }
}

function hasInitialized(status: GroundcoverStatus): boolean {
  return status.type === 'initialized' || status.type === 'recording' || status.type === 'stopped'
}

export function GroundcoverConfigForm({
  form,
  status,
  onInitialize,
  onStartRecording,
  onStopRecording,
}: GroundcoverConfigFormProps) {
  const statusBadge = getStatusBadge(status)

  return (
    <Box component="section" aria-labelledby="gc-demo-heading">
      <Title id="gc-demo-heading" order={2} mb="md">
        Groundcover configuration
      </Title>

      <Box component="form" name="groundcoverDemo" onSubmit={(event) => event.preventDefault()}>
        <Stack gap="sm" maw={520}>
          <PasswordInput
            label="API key"
            autoComplete="off"
            required
            autoFocus
            {...form.getInputProps('apiKey')}
          />
          <TextInput label="Cluster" autoComplete="off" required {...form.getInputProps('cluster')} />
          <TextInput label="Environment" autoComplete="off" required {...form.getInputProps('environment')} />
          <PasswordInput label="DSN" autoComplete="off" required {...form.getInputProps('dsn')} />
          <TextInput label="App ID" autoComplete="off" required {...form.getInputProps('appId')} />

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs" mt="xs">
            <Checkbox label="Add .rr-ignore class" {...form.getInputProps('rrIgnore', { type: 'checkbox' })} />
            <Checkbox label="Add .rr-block class" {...form.getInputProps('rrBlock', { type: 'checkbox' })} />
            <Checkbox label="Add .rr-mask class" {...form.getInputProps('rrMask', { type: 'checkbox' })} />
          </SimpleGrid>

          <Box component="output" mih="1.5rem" aria-live="polite">
            {statusBadge ? (
              <Badge variant="dot" color={statusBadge.color}>
                {statusBadge.message}
              </Badge>
            ) : null}
          </Box>

          <Group gap="xs">
            <Button type="button" onClick={onInitialize}>
              Initialize
            </Button>
            <Button type="button" variant="light" disabled={!hasInitialized(status)} onClick={onStartRecording}>
              Start Recording
            </Button>
            <Button type="button" variant="light" disabled={!hasInitialized(status)} onClick={onStopRecording}>
              Stop Recording
            </Button>
          </Group>
        </Stack>
      </Box>
    </Box>
  )
}
