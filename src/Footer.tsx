import { Anchor, Box, Title } from '@mantine/core'

export function Footer() {
  return (
    <Box component="section">
      <Title order={2} mb="xs">
        Links
      </Title>
      <Anchor href="https://github.com/isqua/groundcover-performance" target="_blank" rel="noreferrer">
        Source code
      </Anchor>
    </Box>
  )
}
