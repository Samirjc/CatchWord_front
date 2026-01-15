const API_BASE_URL = 'http://localhost:3001';

export const endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
  },
  
  escola: {
    create: `${API_BASE_URL}/escola`,
    list: `${API_BASE_URL}/escola`,
    getById: (id) => `${API_BASE_URL}/escola/${id}`,
  },
  
  usuario: {
    verificarToken: (token) => `${API_BASE_URL}/usuario/verificar-token/${token}`,
    completarCadastro: `${API_BASE_URL}/usuario/completar-cadastro`,
    list: `${API_BASE_URL}/usuario`,
    getById: (id) => `${API_BASE_URL}/usuario/${id}`,
    create: `${API_BASE_URL}/usuario`,
    update: (id) => `${API_BASE_URL}/usuario/${id}`,
    delete: (id) => `${API_BASE_URL}/usuario/${id}`,
    reenviarConvite: (id) => `${API_BASE_URL}/usuario/${id}/reenviar-convite`,
  },
    turma: {
    list: `${API_BASE_URL}/turma`,
    getByEscola: (escolaId) => `${API_BASE_URL}/turma/escola/${escolaId}`,
    getByProfessor: (professorId) => `${API_BASE_URL}/turma/professor/${professorId}`,
    getByAluno: (alunoId) => `${API_BASE_URL}/turma/aluno/${alunoId}`,
    getById: (id) => `${API_BASE_URL}/turma/${id}`,
    create: `${API_BASE_URL}/turma`,
    update: (id) => `${API_BASE_URL}/turma/${id}`,
    delete: (id) => `${API_BASE_URL}/turma/${id}`,
    atualizarProfessor: (id) => `${API_BASE_URL}/turma/${id}/professor`,
    removerProfessor: (id) => `${API_BASE_URL}/turma/${id}/professor`,
    adicionarAluno: (id) => `${API_BASE_URL}/turma/${id}/aluno`,
    removerAluno: (id, alunoId) => `${API_BASE_URL}/turma/${id}/aluno/${alunoId}`,
  },
  
  jogo: {
    create: `${API_BASE_URL}/jogo`,
    list: `${API_BASE_URL}/jogo`,
    getById: (id) => `${API_BASE_URL}/jogo/${id}`,
    update: (id) => `${API_BASE_URL}/jogo/${id}`,
    delete: (id) => `${API_BASE_URL}/jogo/${id}`,
    getTabuleiro: (id) => `${API_BASE_URL}/jogo/${id}/tabuleiro`,
  },
};