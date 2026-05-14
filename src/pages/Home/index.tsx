import React, { useState, useEffect } from 'react';
import { 
  Text, 
  Title, 
  Container, 
  SimpleGrid, 
  Card, 
  Badge, 
  Group, 
  Stack,
  rem,
  Loader,
  Center
} from '@mantine/core';

// Importando o serviço que já possui o método listar() configurado
import { produtoService } from '../../services/api';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'Bebidas' | 'Lanches' | 'Pratos';
  disponivel: boolean;
}

export function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categorias = ['Bebidas', 'Lanches', 'Pratos'] as const;

  // Função para buscar os dados da API conforme o requisito GET /api/produtos
  const buscarProdutos = async () => {
    try {
      setLoading(true);
      const dados = await produtoService.listar();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar cardápio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  if (loading) {
    return (
      <Center style={{ height: rem(400) }}>
        <Loader color="orange" size="xl" type="dots" />
      </Center>
    );
  }

  return (
    <Container size="lg">
      <div style={{ textAlign: 'center', marginBottom: rem(40) }}>
        <Title order={1} mb={5}>Nosso Cardápio</Title>
        <Text c="dimmed">
          Sabores preparados com carinho, ingredientes selecionados e muita qualidade.
        </Text>
      </div>

      {categorias.map((cat) => {
        // Filtra os produtos da categoria atual vindos da API
        const produtosDaCategoria = produtos.filter(p => p.categoria === cat);

        // Se não houver produtos na categoria, podemos optar por não renderizar a seção
        if (produtosDaCategoria.length === 0) return null;

        return (
          <Stack key={cat} mb={50}>
            {/* Cabeçalho da Categoria conforme design */}
            <Group justify="space-between" style={{ borderBottom: `${rem(1)} solid #eee` }} pb="xs">
              <Title order={2} size="h3">{cat}</Title>
              <Badge color="orange" variant="light">
                {produtosDaCategoria.length} {produtosDaCategoria.length === 1 ? 'ITEM' : 'ITENS'}
              </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {produtosDaCategoria.map((produto) => (
                <Card key={produto.id} shadow="sm" p="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600} size="lg">{produto.nome}</Text>
                    <Badge 
                      color={produto.disponivel ? "green" : "gray"} 
                      variant="light" // Variant light para combinar com o print da home
                    >
                      {produto.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed" mb="xl" style={{ minHeight: rem(40) }}>
                    {produto.descricao || 'Sem descrição disponível.'}
                  </Text>

                  <Text fw={700} size="xl" c="orange">
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        );
      })}
    </Container>
  );
}