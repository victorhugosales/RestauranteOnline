import { MantineProvider } from '@mantine/core'
import { AppRoutes } from '../src/AppRoutes'

import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      <AppRoutes />
    </MantineProvider>
  )
}

export default App