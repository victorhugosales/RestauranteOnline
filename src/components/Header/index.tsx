import { AppShell, NavLink, Stack, rem } from '@mantine/core';
import { 
  IconToolsKitchen2, 
  IconLayoutDashboard, 
  IconClock, 
  IconStar, 
  IconSettings 
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

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
        <Stack p="xs" gap="md">
          <IconClock style={{ width: rem(20), height: rem(20) }} />
          <IconStar style={{ width: rem(20), height: rem(20) }} />
          <IconSettings style={{ width: rem(20), height: rem(20) }} />
        </Stack>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}