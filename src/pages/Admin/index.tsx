import {
    Table,
    Group,
    Text,
    ActionIcon,
    Badge,
    Button,
    Title,
    Container,
    Modal,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    Switch,
    Stack,
    Image, 
    UnstyledButton, 
    Avatar,
    SimpleGrid,
    Box,
    Loader,
    Center,
    Paper
} from '@mantine/core';
import { IconPencil, IconTrash, IconPlus, IconPhoto } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

import { useState, useEffect } from 'react';
import { produtoService } from '../../services/api';
import { notifications } from '@mantine/notifications';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { PRESET_IMAGES } from '../../constants/imagensPadrao';

interface Produto {
    id: number;
    nome: string;
    descricao: string | null;
    preco: number;
    categoria: 'Bebidas' | 'Lanches' | 'Pratos';
    disponivel: boolean;
    createdAt?: string;
    imagemUrl: string | null;
}

interface FormValores {
    id?: number;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
    disponivel: boolean;
    imagemUrl: string;
}

export function Admin() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas');

    const [openedForm, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    
    const [produtoEmEdicaoId, setProdutoEmEdicaoId] = useState<number | null>(null);
    const [produtoParaRemover, setProdutoParaRemover] = useState<Produto | null>(null);

    // Detecta se a tela é mobile (abaixo de 768px / breakpoint 'sm' do Mantine)
    const isMobile = useMediaQuery('(max-width: 48em)');

    const form = useForm<FormValores>({
        initialValues: {
            nome: '',
            descricao: '',
            preco: 0,
            categoria: '',
            disponivel: true,
            imagemUrl: '',
        },
        validate: {
            nome: (value: string) => (value.length < 3 ? 'Nome muito curto' : null),
            preco: (value: number) => (value <= 0 ? 'Preço inválido' : null),
            categoria: (value: string) => (!value ? 'Obrigatório' : null),
        },
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            const dados = await produtoService.listar();
            setProdutos(dados);
        } catch (error) {
            notifications.show({ title: 'Erro', message: 'Falha ao buscar produtos', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarDados(); }, []);

    const handleNewProduct = () => {
        setProdutoEmEdicaoId(null);
        form.reset();
        openForm();
    };

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
                imagemUrl: produtoLocal.imagemUrl || '',
            });
            form.resetDirty();
            openForm();
        }
    };

    const handleSubmit = async (values: FormValores) => {
        try {
            setLoadingSubmit(true);
            if (produtoEmEdicaoId) {
                await produtoService.atualizar(produtoEmEdicaoId, values);
                notifications.show({ title: 'Sucesso', message: 'Produto atualizado!', color: 'green' });
            } else {
                await produtoService.cadastrar(values);
                notifications.show({ title: 'Sucesso', message: 'Produto cadastrado!', color: 'green' });
            }
            closeForm();
            carregarDados();
        } catch (error: any) {
            notifications.show({ title: 'Erro', message: 'Erro na operação', color: 'red' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleDelete = async () => {
        if (!produtoParaRemover) return;
        try {
            setLoadingDelete(true);
            await produtoService.remover(produtoParaRemover.id);
            notifications.show({ title: 'Sucesso', message: 'Removido!', color: 'green' });
            closeDelete();
            carregarDados();
        } catch (error) {
            notifications.show({ title: 'Erro', message: 'Erro ao remover', color: 'red' });
        } finally {
            setLoadingDelete(false);
        }
    };

    const imagensFiltradas = categoriaFiltro === 'Todas' 
        ? PRESET_IMAGES 
        : PRESET_IMAGES.filter(img => img.categoria === categoriaFiltro);

    // LAYOUT DESKTOP: Linhas tradicionais da Tabela
    const tableRows = produtos.map((produto) => (
        <Table.Tr key={produto.id}>
            <Table.Td>
                <Avatar src={produto.imagemUrl || ''} radius="md" size="sm">
                    <IconPhoto size="1rem" />
                </Avatar>
            </Table.Td>
            <Table.Td fw={500}>{produto.nome}</Table.Td>
            <Table.Td>
                <Badge variant="light" color="orange" size="sm">{produto.categoria.toUpperCase()}</Badge>
            </Table.Td>
            <Table.Td fw={700}>R$ {produto.preco.toFixed(2)}</Table.Td>
            <Table.Td>
                <Badge color={produto.disponivel ? 'green' : 'gray'} variant="filled">
                    {produto.disponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <ActionIcon variant="light" color="blue" onClick={() => handleEdit(produto.id)}><IconPencil size="1rem" /></ActionIcon>
                    <ActionIcon variant="light" color="red" onClick={() => { setProdutoParaRemover(produto); openDelete(); }}><IconTrash size="1rem" /></ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    // LAYOUT MOBILE: Cards empilhados idênticos ao print do Lovable
    const mobileCards = produtos.map((produto) => (
        <Paper key={produto.id} withBorder p="md" radius="lg" shadow="xs">
            <Group align="flex-start" wrap="nowrap" gap="md">
                <Image 
                    src={produto.imagemUrl || ''} 
                    fallbackSrc="https://placehold.co/600x400?text=Sem+Foto"
                    w={80} 
                    h={80} 
                    radius="md" 
                    style={{ objectFit: 'cover' }}
                />
                
                <Stack gap={4} style={{ flex: 1 }}>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Text fw={700} size="md" lineClamp={2}>{produto.nome}</Text>
                        <Text fw={700} size="md" c="orange.6" style={{ whiteSpace: 'nowrap' }}>
                            R$ {produto.preco.toFixed(2)}
                        </Text>
                    </Group>
                    
                    {produto.descricao && (
                        <Text size="xs" c="dimmed" lineClamp={2} mb={4}>
                            {produto.descricao}
                        </Text>
                    )}

                    <Group gap="xs">
                        <Badge variant="light" color="orange" size="xs">
                            {produto.categoria.toUpperCase()}
                        </Badge>
                        <Badge color={produto.disponivel ? 'green' : 'gray'} variant="filled" size="xs">
                            {produto.disponivel ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
                        </Badge>
                    </Group>
                </Stack>
            </Group>

            <Group justify="flex-end" gap="sm" mt="md" pt="xs" style={{ borderTop: '1px solid #f1f3f5' }}>
                <ActionIcon variant="light" color="blue" size="md" radius="md" onClick={() => handleEdit(produto.id)}>
                    <IconPencil size="1.1rem" />
                </ActionIcon>
                <ActionIcon variant="light" color="red" size="md" radius="md" onClick={() => { setProdutoParaRemover(produto); openDelete(); }}>
                    <IconTrash size="1.1rem" />
                </ActionIcon>
            </Group>
        </Paper>
    ));

    return (
        <Container size="xl" py="xl">
            {/* Modal de Formulário - Responsivo (Tela cheia no mobile) */}
            <Modal 
                opened={openedForm} 
                onClose={closeForm} 
                title={produtoEmEdicaoId ? "Editar produto" : "Novo produto"} 
                size="lg" 
                centered
                fullScreen={isMobile}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput label="Nome" required {...form.getInputProps('nome')} />
                        <Textarea label="Descrição" rows={3} {...form.getInputProps('descricao')} />
                        <Group grow={!isMobile}>
                            <NumberInput label="Preço" decimalScale={2} prefix="R$ " required {...form.getInputProps('preco')} />
                            <Select label="Categoria" data={['Bebidas', 'Lanches', 'Pratos']} required {...form.getInputProps('categoria')} />
                        </Group>

                        <TextInput label="URL da Imagem" placeholder="https://..." {...form.getInputProps('imagemUrl')} />

                        <Box>
                            <Group justify="space-between" mb="xs" direction={isMobile ? 'column' : 'row'}>
                                <Text size="sm" fw={500}>Imagens prontas</Text>
                                <Group gap={5}>
                                    {['Todas', 'Bebidas', 'Lanches', 'Pratos'].map(cat => (
                                        <Button key={cat} size="compact-xs" variant={categoriaFiltro === cat ? 'filled' : 'light'} color="orange" onClick={() => setCategoriaFiltro(cat)}>{cat}</Button>
                                    ))}
                                </Group>
                            </Group>
                            <SimpleGrid cols={isMobile ? 3 : 4} spacing="xs">
                                {imagensFiltradas.map((img) => (
                                    <UnstyledButton 
                                        key={img.url} 
                                        onClick={() => form.setFieldValue('imagemUrl', img.url)}
                                        style={{ 
                                            border: form.values.imagemUrl === img.url ? '2px solid orange' : '2px solid transparent',
                                            borderRadius: '8px', overflow: 'hidden'
                                        }}
                                    >
                                        <Image src={img.url} height={60} style={{ objectFit: 'cover' }} />
                                    </UnstyledButton>
                                ))}
                            </SimpleGrid>
                        </Box>

                        <Switch label="Disponível no cardápio" color="orange" checked={form.values.disponivel} {...form.getInputProps('disponivel', { type: 'checkbox' })} />
                        <Group justify="flex-end" mt="md">
                            <Button variant="subtle" onClick={closeForm}>Cancelar</Button>
                            <Button type="submit" color="orange" loading={loadingSubmit}>{produtoEmEdicaoId ? "Salvar alterações" : "Cadastrar"}</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            {/* Modal de Confirmação de Deleção */}
            <Modal opened={openedDelete} onClose={closeDelete} title="Confirmar exclusão" centered>
                <Text size="sm">Tem certeza que deseja excluir <b>{produtoParaRemover?.nome}</b>?</Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={closeDelete}>Não, manter</Button>
                    <Button color="red" onClick={handleDelete} loading={loadingDelete}>Sim, excluir</Button>
                </Group>
            </Modal>

            {/* Header Responsivo */}
            <Group justify="space-between" align="center" mb="xl" wrap="nowrap">
                <div>
                    <Title order={isMobile ? 3 : 2}>Gestão de Cardápio</Title>
                    <Text size="sm" c="dimmed">{produtos.length} produtos cadastrados</Text>
                </div>
                <Button 
                    leftSection={<IconPlus size="1.2rem" />} 
                    color="orange" 
                    onClick={handleNewProduct}
                    size={isMobile ? 'sm' : 'md'}
                >
                    {isMobile ? 'Novo' : 'Novo produto'}
                </Button>
            </Group>

            {/* Alternância Dinâmica de Layout (Tabela vs Cards Mobile) */}
            {loading ? (
                <Center py="xl"><Loader color="orange" /></Center>
            ) : isMobile ? (
                <Stack gap="md">
                    {mobileCards}
                </Stack>
            ) : (
                <Table highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Foto</Table.Th>
                            <Table.Th>Nome</Table.Th>
                            <Table.Th>Categoria</Table.Th>
                            <Table.Th>Preço</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Ações</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tableRows}</Table.Tbody>
                </Table>
            )}
        </Container>
    );
}