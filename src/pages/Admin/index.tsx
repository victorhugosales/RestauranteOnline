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

interface FormValores {
    id?: number; // Opcional pois o novo produto não tem ID ainda
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponivel: boolean;
}

export function Admin() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    // Modais
    const [openedForm, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    
    // Se for null, o modal entende que é "Novo Produto". Se tiver ID, é "Edição".
    const [produtoEmEdicaoId, setProdutoEmEdicaoId] = useState<number | null>(null);
    const [produtoParaRemover, setProdutoParaRemover] = useState<Produto | null>(null);

    const form = useForm<FormValores>({
        initialValues: {
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
            notifications.show({ title: 'Erro', message: 'Falha ao buscar produtos da API', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // Função para abrir o modal de CADASTRO
    const handleNewProduct = () => {
        setProdutoEmEdicaoId(null);
        form.reset();
        openForm();
    };

    // Função para abrir o modal de EDIÇÃO
    const handleEdit = (produtoId: number) => {
        form.clearErrors();
        setProdutoEmEdicaoId(produtoId);
        
        const produtoLocal = produtos.find(p => p.id === produtoId);
        if (produtoLocal) {
            form.setValues({
                nome: produtoLocal.nome,
                descricao: produtoLocal.descricao || '', 
                preco: produtoLocal.preco,
                categoria: produtoLocal.categoria,
                disponivel: produtoLocal.disponivel,
            });
            form.resetDirty();
            openForm();
        }
    };

    // Função unificada para SALVAR (Create ou Update)
    const handleSubmit = async (values: FormValores) => {
        try {
            setLoadingSubmit(true);
            const dadosParaEnviar = { 
                ...values, 
                descricao: values.descricao || null 
            };

            if (produtoEmEdicaoId) {
                // Modo Edição: PUT /api/produtos/:id
                await produtoService.atualizar(produtoEmEdicaoId, dadosParaEnviar);
                notifications.show({ title: 'Sucesso', message: 'Produto atualizado!', color: 'green' });
            } else {
                // Modo Cadastro: POST /api/produtos
                await produtoService.cadastrar(dadosParaEnviar);
                notifications.show({ title: 'Sucesso', message: 'Produto cadastrado!', color: 'green' });
            }

            closeForm();
            carregarDados();
        } catch (error: any) {
            // Exibe erro da API (400) ou erro genérico
            notifications.show({ 
                title: 'Erro', 
                message: error.response?.data?.error || 'Falha ao processar requisição', 
                color: 'red' 
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleConfirmDelete = (produto: Produto) => {
        setProdutoParaRemover(produto);
        openDelete();
    };

    const handleDelete = async () => {
        if (!produtoParaRemover) return;
        try {
            setLoadingDelete(true);
            await produtoService.remover(produtoParaRemover.id);
            notifications.show({ title: 'Sucesso', message: 'Produto removido!', color: 'green' });
            closeDelete();
            carregarDados();
        } catch (error: any) {
            notifications.show({ title: 'Erro', message: 'Falha ao remover produto', color: 'red' });
        } finally {
            setLoadingDelete(false);
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
                    <ActionIcon variant="light" color="blue" onClick={() => handleEdit(produto.id)}>
                        <IconPencil size="1.2rem" />
                    </ActionIcon>
                    <ActionIcon variant="light" color="red" onClick={() => handleConfirmDelete(produto)}>
                        <IconTrash size="1.2rem" />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size="xl">
            {/* Modal Único para Cadastro/Edição */}
            <Modal 
                opened={openedForm} 
                onClose={closeForm} 
                title={produtoEmEdicaoId ? "Editar produto" : "Novo produto"} 
                centered 
                size="md" 
                padding="xl"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput 
                            label="Nome" 
                            placeholder="Ex: Hambúrguer Artesanal" 
                            required 
                            {...form.getInputProps('nome')} 
                        />
                        <Textarea 
                            label="Descrição" 
                            placeholder="Ingredientes, modo de preparo, etc." 
                            rows={4} 
                            required 
                            {...form.getInputProps('descricao')} 
                        />
                        <Group grow>
                            <NumberInput 
                                label="Preço" 
                                placeholder="0,00" 
                                decimalScale={2} 
                                fixedDecimalScale 
                                prefix="R$ " 
                                required 
                                {...form.getInputProps('preco')} 
                            />
                            <Select 
                                label="Categoria" 
                                placeholder="Selecione" 
                                required 
                                data={['Bebidas', 'Lanches', 'Pratos']} 
                                {...form.getInputProps('categoria')} 
                            />
                        </Group>
                        <Switch 
                            label="Disponível no cardápio" 
                            color="orange" 
                            checked={form.values.disponivel} 
                            {...form.getInputProps('disponivel', { type: 'checkbox' })} 
                        />
                        <Group justify="flex-end" mt="xl">
                            <Button variant="subtle" color="gray" onClick={closeForm}>Cancelar</Button>
                            <Button 
                                type="submit" 
                                color="orange" 
                                loading={loadingSubmit}
                            >
                                {produtoEmEdicaoId ? "Salvar alterações" : "Cadastrar"}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Modal de Exclusão */}
            <Modal opened={openedDelete} onClose={closeDelete} title="Remover produto" centered size="sm">
                <Stack gap="md">
                    <Text size="sm">
                        Tem certeza que deseja remover <Text span fw={700}>{produtoParaRemover?.nome}</Text>? Esta ação não pode ser desfeita.
                    </Text>
                    <Group justify="flex-end" gap="sm">
                        <Button variant="outline" color="gray" onClick={closeDelete} size="xs">Cancelar</Button>
                        <Button color="red" onClick={handleDelete} loading={loadingDelete} size="xs">Remover</Button>
                    </Group>
                </Stack>
            </Modal>

            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2}>Gestão de Cardápio</Title>
                    <Text c="dimmed" size="sm">
                        {loading ? 'Carregando...' : `${produtos.length} produtos cadastrados`}
                    </Text>
                </div>
                <Button 
                    leftSection={<IconPlus size="1.2rem" />} 
                    color="orange" 
                    radius="md"
                    onClick={handleNewProduct} // Gatilho para Novo Produto
                >
                    Novo produto
                </Button>
            </Group>

            {loading ? (
                <Center my="xl"><Loader color="orange" type="dots" /></Center>
            ) : (
                <Table highlightOnHover withTableBorder>
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
            )}
        </Container>
    );
}