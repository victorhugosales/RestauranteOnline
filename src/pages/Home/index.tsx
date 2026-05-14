import React from 'react';
import { 
  Text, 
  Title, 
  Container, 
  SimpleGrid, 
  Card, 
  Badge, 
  Group, 
  Stack,
  rem
} from '@mantine/core';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'Bebidas' | 'Lanches' | 'Pratos';
  disponivel: boolean;
}

const PRODUTOS_MOCK: Produto[] = [
  { id: 1, nome: 'Suco Natural de Laranja', descricao: '300ml, espremido na hora, sem açúcar.', preco: 9.50, categoria: 'Bebidas', disponivel: true },
  { id: 2, nome: 'Cerveja Artesanal IPA', descricao: 'Garrafa 500ml, lúpulo cítrico, amargor equilibrado.', preco: 22.00, categoria: 'Bebidas', disponivel: true },
  { id: 3, nome: 'Hambúrguer Artesanal', descricao: 'Pão brioche, blend 180g, queijo cheddar, bacon e molho da casa.', preco: 32.90, categoria: 'Lanches', disponivel: true },
  { id: 4, nome: 'Risoto de Funghi', descricao: 'Arroz arbóreo, funghi secchi, parmesão e finalização com trufa.', preco: 58.00, categoria: 'Pratos', disponivel: false },
];

export function Home() {
  const categorias = ['Bebidas', 'Lanches', 'Pratos'] as const;

  return (
    <Container size="lg">
      <div style={{ textAlign: 'center', marginBottom: rem(40) }}>
        <Title order={1} mb={5}>Nosso Cardápio</Title>
        <Text c="dimmed">Sabores preparados com carinho, ingredientes selecionados e muita qualidade.</Text>
      </div>

      {categorias.map((cat) => (
        <Stack key={cat} mb={50}>
          {/* Cabeçalho da Categoria */}
          <Group justify="space-between" style={{ borderBottom: `${rem(1)} solid #eee` }} pb="xs">
            <Title order={2} size="h3">{cat}</Title>
            <Badge color="orange" variant="light">
              {PRODUTOS_MOCK.filter(p => p.categoria === cat).length} ITENS
            </Badge>
          </Group>

          {/* Grid de Produtos conforme os requisitos de exibição [cite: 7, 25] */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {PRODUTOS_MOCK.filter(p => p.categoria === cat).map((produto) => (
              <Card key={produto.id} shadow="sm" p="lg" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={600} size="lg">{produto.nome}</Text>
                  <Badge color={produto.disponivel ? "green" : "gray"} variant="filled">
                    {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" mb="xl" style={{ minHeight: rem(40) }}>
                  {produto.descricao}
                </Text>

                <Text fw={700} size="xl" c="orange">
                  R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      ))}
    </Container>
  );
}