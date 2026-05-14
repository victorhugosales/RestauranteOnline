import axios from 'axios';

// A URL deve apontar para o seu servidor Node.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||  'http://localhost:6543/api', 
});

export const produtoService = {
  // Conforme requisito: GET /api/produtos [cite: 18]
  listar: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },

  obterPorId: async (id: number) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  // Conforme requisito: POST /api/produtos [cite: 19]
  cadastrar: async (dados: any) => {
    const response = await api.post('/produtos', dados);
    return response.data;
  },

  // Conforme requisito: DELETE /api/produtos/:id [cite: 21]
  remover: async (id: number) => {
    await api.delete(`/produtos/${id}`);
  },

  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/produtos/${id}`, dados);
    return response.data;
  },
};