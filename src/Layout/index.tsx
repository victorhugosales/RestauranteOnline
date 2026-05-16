import { AppShell, Group, Text, Badge } from '@mantine/core';
import { IconToolsKitchen2 } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Header'; // Corrigido para garantir o caminho
import { useMediaQuery } from '@mantine/hooks';

export function MainLayout() {
  // Detecta se a tela é mobile de forma reativa (true se for menor que 768px)
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <AppShell
      header={{ height: 60 }}
      
      // Se for mobile, desativa a navbar completamente (undefined). 
      // Se for desktop, injeta o objeto com a largura de 250px.
      navbar={!isMobile ? { width: 250, breakpoint: 'sm' } : undefined}
      
      // Se for mobile, injeta o footer de 60px.
      // Se for desktop, desativa o footer completamente (undefined).
      footer={isMobile ? { height: 60} : undefined}
      
      padding="md"
    >
      <AppShell.Header p="xs">
        <Group justify="space-between" h="100%">
          <Group gap="xs">
            <IconToolsKitchen2 color="orange" size="1.5rem" />
            <Text fw={700} size="lg">Sabor & Cia</Text>
          </Group>
          <Badge 
            variant="filled" 
            color="orange" 
            size={isMobile ? "sm" : "lg"}
          >
            {isMobile ? "APP" : "RESTAURANTE ONLINE"}
          </Badge>
        </Group>
      </AppShell.Header>

      {/* A sua Sidebar vai renderizar de forma segura o <AppShell.Navbar> 
          ou o <AppShell.Footer> internamente baseado nas mesmas regras */}
      <Sidebar />

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}