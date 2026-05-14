import { AppShell, Group, Text, Badge } from '@mantine/core';
import { IconToolsKitchen2 } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Header';

export function MainLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header p="xs">
        <Group justify="space-between" h="100%">
          <Group>
            <IconToolsKitchen2 color="orange" size="1.5rem" />
            <Text fw={700} size="lg">Sabor & Cia</Text>
          </Group>
          <Badge variant="filled" color="orange" size="lg">RESTAURANTE ONLINE</Badge>
        </Group>
      </AppShell.Header>

      <Sidebar />

      <AppShell.Main>
        {/* O Outlet renderiza a página atual (Home ou Admin) aqui dentro */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}