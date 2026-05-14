import React from 'react';
import {
    Table,
    Group,
    Text,
    ActionIcon,
    Badge,
    Button,
    Title,
    Container,
    rem
} from '@mantine/core';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';

import { useState, useEffect } from 'react';
import { produtoService } from '../../services/api';
import { notifications } from '@mantine/notifications';

// Tipagem baseada nos requisitos do banco de dados [cite: 10, 11, 13, 14, 15]
interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    categoria: 'Bebidas' | 'Lanches' | 'Pratos';
    disponivel: boolean;
}

const PRODUTOS_MOCK: Produto[] = [
    { id: 1, nome: 'Hambúrguer Artesanal', descricao: 'Pão brioche, blend 180g, queijo cheddar, bacon e molho da casa.', preco: 32.90, categoria: 'Lanches', disponivel: true },
    { id: 2, nome: 'Pizza Margherita', descricao: 'Molho de tomate San Marzano, mussarela de búfala e manjericão fresco.', preco: 49.90, categoria: 'Pratos', disponivel: true },
    { id: 3, nome: 'Suco Natural de Laranja', descricao: '300ml, espremido na hora, sem açúcar.', preco: 9.50, categoria: 'Bebidas', disponivel: true },
    { id: 4, nome: 'Risoto de Funghi', descricao: 'Arroz arbóreo, funghi secchi, parmesão e finalização com trufa.', preco: 58.00, categoria: 'Pratos', disponivel: false },
    { id: 5, nome: 'Cerveja Artesanal IPA', descricao: 'Garrafa 500ml, lúpulo cítrico, amargor equilibrado.', preco: 22.00, categoria: 'Bebidas', disponivel: true },
    { id: 6, nome: 'Chupisca', descricao: 'Chupiscante', preco: 6.66, categoria: 'Lanches', disponivel: true },
];

export function Admin() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    const carregarDados = async () => {
        try {
            const dados = await produtoService.listar();
            setProdutos(dados);
        } catch (error) {
            notifications.show({ title: 'Erro', message: 'Falha ao buscar produtos', color: 'red' });[cite: 28]
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);
    const rows = PRODUTOS_MOCK.map((produto) => (
        <Table.Tr key={produto.id}>
            <Table.Td>{produto.id}</Table.Td>
            <Table.Td fw={500}>{produto.nome}</Table.Td>
            <Table.Td style={{ maxWidth: rem(300) }}>
                <Text size="sm" truncate="end">{produto.descricao}</Text>
            </Table.Td>
            <Table.Td>
                <Badge variant="light" color="orange" size="sm">{produto.categoria.toUpperCase()}</Badge>
            </Table.Td>
            <Table.Td fw={700}>
                R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Table.Td>
            <Table.Td>
                <Badge color={produto.disponivel ? 'green' : 'gray'} variant="filled">
                    {produto.disponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <ActionIcon variant="light" color="blue" title="Editar">
                        <IconPencil size="1.2rem" />
                    </ActionIcon>
                    <ActionIcon variant="light" color="red" title="Excluir">
                        <IconTrash size="1.2rem" />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size="xl">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2}>Gestão de Cardápio</Title>
                    <Text c="dimmed" size="sm">{PRODUTOS_MOCK.length} produtos cadastrados</Text>
                </div>
                <Button leftSection={<IconPlus size="1.2rem" />} color="orange" radius="md">
                    Novo produto
                </Button>
            </Group>

            <Table highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Nome</Table.Th>
                        <Table.Th>Descrição</Table.Th>
                        <Table.Th>Categoria</Table.Th>
                        <Table.Th>Preço</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Ações</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Container>
    );
}