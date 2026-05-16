import { AppShell, Group, NavLink, Stack, rem, UnstyledButton, Text, Center } from '@mantine/core';
import { 
  IconToolsKitchen2, 
  IconLayoutDashboard, 
  IconClock, 
  IconStar, 
  IconSettings 
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';

export function Sidebar() {
  const location = useLocation();
  // Detecta se a tela é mobile (abaixo de 768px / 48em)
  const isMobile = useMediaQuery('(max-width: 48em)');

  // Se for Mobile, renderiza a barra inferior de navegação rápida
  if (isMobile) {
    return (
      <AppShell.Footer p={0} style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
        <Group justify="space-around" style={{ width: '100%', height: '100%' }} gap={0}>
          
          {/* Link: Cardápio */}
          <UnstyledButton
            component={Link}
            to="/"
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: location.pathname === '/' ? 'var(--mantine-color-orange-6)' : 'var(--mantine-color-dimmed)',
              backgroundColor: location.pathname === '/' ? 'var(--mantine-color-orange-0)' : 'transparent',
            }}
          >
            <IconToolsKitchen2 size="1.3rem" />
            <Text size="10px" fw={location.pathname === '/' ? 700 : 500}>Cardápio</Text>
          </UnstyledButton>

          {/* Link: Admin */}
          <UnstyledButton
            component={Link}
            to="/admin"
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: location.pathname === '/admin' ? 'var(--mantine-color-orange-6)' : 'var(--mantine-color-dimmed)',
              backgroundColor: location.pathname === '/admin' ? 'var(--mantine-color-orange-0)' : 'transparent',
            }}
          >
            <IconLayoutDashboard size="1.3rem" />
            <Text size="10px" fw={location.pathname === '/admin' ? 700 : 500}>Painel</Text>
          </UnstyledButton>

          {/* Ícones Utilitários Compactados em um único botão de Opções/Ações extras ou ocultos no mobile se não tiverem rota */}
          <UnstyledButton
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--mantine-color-dimmed)',
            }}
          >
            <IconSettings size="1.3rem" />
            <Text size="10px">Ajustes</Text>
          </UnstyledButton>

        </Group>
      </AppShell.Footer>
    );
  }

  // Layout Desktop Tradicional (Mantém como estava na lateral)
  return (
    <AppShell.Navbar p="xs">
      <AppShell.Section grow>
        <NavLink
          component={Link}
          to="/"
          label="Cardápio Público"
          leftSection={<IconToolsKitchen2 size="1rem" />}
          active={location.pathname === '/'}
          variant="light"
          color="orange"
        />
        <NavLink
          component={Link}
          to="/admin"
          label="Área Administrativa"
          leftSection={<IconLayoutDashboard size="1rem" />}
          active={location.pathname === '/admin'}
          variant="light"
          color="orange"
        />
      </AppShell.Section>

      <AppShell.Section>
        <Center>
          <Stack p="xs" gap="md" align="center">
            <IconClock style={{ width: rem(20), height: rem(20), color: 'var(--mantine-color-dimmed)' }} />
            <IconStar style={{ width: rem(20), height: rem(20), color: 'var(--mantine-color-dimmed)' }} />
            <IconSettings style={{ width: rem(20), height: rem(20), color: 'var(--mantine-color-dimmed)' }} />
          </Stack>
        </Center>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}