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
    rem,
    Modal,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    Switch,
    Stack,
    Loader,
    Center
} from '@mantine/core';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

import { useState, useEffect } from 'react';
import { produtoService } from '../../services/api';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

interface Produto {
    id: number;
    nome: string;
    descricao: string | null;
    preco: number;
    categoria: 'Bebidas' | 'Lanches' | 'Pratos';
    disponivel: boolean;
    createdAt?: string;
}

// Tipagem para os valores iniciais do formulário do Mantine
interface FormValores {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponivel: boolean;
}

export function Admin() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    const [opened, { open, close }] = useDisclosure(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [produtoEmEdicaoId, setProdutoEmEdicaoId] = useState<number | null>(null)
    
    // Adicionado tipagem genérica <FormValores> para evitar implicit 'any'
    const form = useForm<FormValores>({
        initialValues: {
            id: 0,
            nome: '',
            descricao: '',
            preco: 0,
            categoria: '',
            disponivel: true,
        },

        validate: {
            nome: (value: string) => (value.length < 3 ? 'Nome deve ter pelo menos 3 caracteres' : (value.length > 100 ? 'Nome máx. 100 caracteres' : null)),
            descricao: (value: string) => (value && value.length > 500 ? 'Descrição máx. 500 caracteres' : null),
            preco: (value: number) => (value <= 0 ? 'O preço deve ser um número maior que zero' : null),
            categoria: (value: string) => (!value ? 'A categoria é obrigatória' : null),
        },
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            const dados = await produtoService.listar();
            setProdutos(dados);
        } catch (error) {
            notifications.show({
                title: 'Erro',
                message: 'Falha ao buscar produtos da API',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const handleEdit = (produtoId: number) => {
        // 1. Limpa erros de validações anteriores
        form.clearErrors();
        setProdutoEmEdicaoId(produtoId);
        
        // 2. Abre o modal imediatamente na tela
        open(); 

        // 3. Busca o produto direto da lista que já veio do banco no useEffect
        const produtoLocal = produtos.find(p => p.id === produtoId);
        
        if (produtoLocal) {
            form.setValues({
                id: produtoLocal.id,
                nome: produtoLocal.nome,
                descricao: produtoLocal.descricao || '', 
                preco: produtoLocal.preco,
                categoria: produtoLocal.categoria,
                disponivel: produtoLocal.disponivel,
            });
            form.resetDirty(); // Avisa o Mantine Form que o estado inicial foi carregado
        }
    };

    const handleSave = async (values: FormValores) => {
        if (!produtoEmEdicaoId) return;

        try {
            setLoadingEdit(true);

            const dadosParaEnviar = {
                ...values,
                descricao: values.descricao || null,
            };

            await produtoService.atualizar(produtoEmEdicaoId, dadosParaEnviar);

            notifications.show({ title: 'Sucesso', message: 'Produto atualizado com sucesso!', color: 'green' });
            close();
            carregarDados();

        } catch (error: any) {
            notifications.show({ title: 'Erro', message: error.response?.data?.error || 'Falha ao salvar edições do produto', color: 'red' });
        } finally {
            setLoadingEdit(false);
        }
    };

    const rows = produtos.map((produto: Produto) => (
        <Table.Tr key={produto.id}>
            <Table.Td>{produto.id}</Table.Td>
            <Table.Td fw={500}>{produto.nome}</Table.Td>
            <Table.Td style={{ maxWidth: rem(300) }}>
                <Text size="sm" truncate="end">{produto.descricao || 'Sem descrição.'}</Text>
            </Table.Td>
            <Table.Td>
                <Badge variant="light" color="orange" size="sm">
                    {produto.categoria ? produto.categoria.toUpperCase() : 'GERAL'}
                </Badge>
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
                    <ActionIcon
                        variant="light"
                        color="blue"
                        title="Editar"
                        onClick={(e) => {
                            e.stopPropagation(); // Evita que o clique afete a linha da tabela
                            handleEdit(produto.id);
                        }}>
                        <IconPencil size="1.2rem" />
                    </ActionIcon>
                    <ActionIcon
                        variant="light"
                        color="red"
                        title="Excluir">
                        <IconTrash size="1.2rem" />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size="xl">
            <Modal opened={opened} onClose={close} title="Editar produto" centered size="md" padding="xl">
                {loadingEdit ? (
                    <Center my="xl">
                        <Loader color="orange" type="dots" size="lg" />
                    </Center>
                ) : (
                    <form onSubmit={form.onSubmit(handleSave)}>
                        <Stack gap="md">
                            <TextInput label="Nome" placeholder="Hambúrguer Artesanal" required {...form.getInputProps('nome')} />
                            <Textarea label="Descrição" placeholder="Pão brioche..." rows={4} required {...form.getInputProps('descricao')} />

                            <Group grow gap="md">
                                <NumberInput label="Preço" placeholder="R$ 32,90" min={0} decimalScale={2} fixedDecimalScale prefix="R$ " required {...form.getInputProps('preco')} />
                                <Select label="Categoria" placeholder="Lanches" required data={['Bebidas', 'Lanches', 'Pratos']} {...form.getInputProps('categoria')} />
                            </Group>

                            <Switch label="Disponível no cardápio" color="orange" checked={form.values.disponivel} {...form.getInputProps('disponivel', { type: 'checkbox' })} />

                            <Group justify="flex-end" mt="xl" gap="sm">
                                <Button variant="subtle" color="gray" onClick={close} size="sm">Cancelar</Button>
                                <Button type="submit" color="orange" radius="md" size="sm" loading={loadingEdit}>Salvar alterações</Button>
                            </Group>
                        </Stack>
                    </form>
                )}
            </Modal>

            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2}>Gestão de Cardápio</Title>
                    <Text c="dimmed" size="sm">
                        {loading ? 'Carregando quantidade...' : `${produtos.length} produtos cadastrados`}
                    </Text>
                </div>
                <Button leftSection={<IconPlus size="1.2rem" />} color="orange" radius="md">
                    Novo produto
                </Button>
            </Group>

            {loading ? (
                <Center my="xl">
                    <Loader color="orange" type="dots" size="lg" />
                </Center>
            ) : (
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
                    <Table.Tbody>
                        {rows.length > 0 ? rows : (
                            <Table.Tr>
                                <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                                    <Text c="dimmed" py="xl">Nenhum produto cadastrado.</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            )}
        </Container>
    );
}