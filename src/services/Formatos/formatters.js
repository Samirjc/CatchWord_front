/**
 * Utilitários de formatação de dados
 */

/**
 * Formata um CPF no padrão brasileiro (xxx.xxx.xxx-xx)
 * @param {string} value - CPF sem formatação ou parcialmente formatado
 * @returns {string} CPF formatado
 */
export const formatCPF = (value) => {
  const cpf = value.replace(/\D/g, '');
  
  const limitedCpf = cpf.slice(0, 11);
  
  return limitedCpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

/**
 * Formata um CNPJ no padrão brasileiro (xx.xxx.xxx/xxxx-xx)
 * @param {string} value - CNPJ sem formatação ou parcialmente formatado
 * @returns {string} CNPJ formatado
 */
export const formatCNPJ = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 14) {
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return value;
};

/**
 * Formata um CEP no padrão brasileiro (xxxxx-xxx)
 * @param {string} value - CEP sem formatação ou parcialmente formatado
 * @returns {string} CEP formatado
 */
export const formatCEP = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 8) {
    return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  return value;
};
