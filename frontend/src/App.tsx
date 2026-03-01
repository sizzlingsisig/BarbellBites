import AppRouter from './router'
import { MantineProvider } from '@mantine/core'
import { theme } from './theme'

function App() {
  return (
    <MantineProvider theme={theme}>
      <AppRouter />
    </MantineProvider>
  )
}

export default App
