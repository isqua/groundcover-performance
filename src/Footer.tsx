import { Anchor, Box, Text, Title } from '@mantine/core'
import packageJson from '../package.json'

export function Footer() {
  const commitHash = import.meta.env.VITE_COMMIT_HASH
  const shortHash = commitHash ? commitHash.substring(0, 7) : 'dev'
  const groundcoverVersion = packageJson.dependencies['@groundcover/browser'] ?? 'unknown'
  const sourceCodeUrl = `https://github.com/isqua/groundcover-performance/tree/${commitHash}`

  return (
    <Box component="section">
      <Title order={2} mb="xs">
        Details
      </Title>
      <Text size="xs" c="dimmed" mt="xs">
        App version:{' '}
        <Anchor href={sourceCodeUrl} target="_blank" rel="noreferrer">
          {shortHash}
        </Anchor>
        {' • '}
        Groundcover version: {groundcoverVersion}
      </Text>
    </Box>
  )
}
