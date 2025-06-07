import { useState } from 'react';

function ProfessionalSupportForm() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    responsibleName: '',
    contactEmail: '',
    problemDomain: '',
    problemDescription: '',
    isUrgent: false,
    isAffectingOperations: false,
    issueTypes: [],
    otherIssueDescription: ''
  });

  const issueCategories = [
    'Alteração de imagens na plataforma',
    'Alteração de preços',
    'Problemas para realizar pedidos',
    'Dificuldade para fechar mesa',
    'Plataforma indisponível ou instável',
    'Problemas com login ou acesso',
    'Dúvidas sobre funcionalidades',
    'Solicitação de novas funcionalidades',
    'Erros ou bugs no sistema',
    'Outros'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIssueTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newIssueTypes = checked
        ? [...prev.issueTypes, value]
        : prev.issueTypes.filter(type => type !== value);
      
      return {
        ...prev,
        issueTypes: newIssueTypes
      };
    });
  };

  const generateWhatsAppLink = () => {
    const selectedIssues = formData.issueTypes.join(', ');
    const otherIssueText = formData.issueTypes.includes('Outros') 
      ? `\n*Detalhes do "Outros":* ${formData.otherIssueDescription}` 
      : '';

    const message = `*SOLICITAÇÃO DE SUPORTE TÉCNICO - WebSolutions*\n\n` +
      `*Restaurante:* ${formData.restaurantName}\n` +
      `*Responsável:* ${formData.responsibleName}\n` +
      `*E-mail de contato:* ${formData.contactEmail}\n` +
      `*Domínio afetado:* ${formData.problemDomain}\n\n` +
      `*Tipo(s) de Problema(s):* ${selectedIssues}${otherIssueText}\n\n` +
      `*Descrição Detalhada:*\n${formData.problemDescription}\n\n` +
      `*Urgente:* ${formData.isUrgent ? '✅ Sim' : '❌ Não'}\n` +
      `*Afetando operações:* ${formData.isAffectingOperations ? '✅ Sim' : '❌ Não'}\n\n` +
      `*Observação:* Caso necessite enviar prints ou arquivos, aguarde nosso contato para orientações.`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/351933737672?text=${encodedMessage}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.issueTypes.length === 0) {
      alert('Por favor, selecione pelo menos um tipo de problema');
      return;
    }
    window.open(generateWhatsAppLink(), '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Suporte Técnico WebSolutions</h1>
                <p className="mt-1 text-indigo-100">Sistema de Gestão para Restaurantes</p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536" />
                </svg>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800">Formulário de Solicitação</h2>
              <p className="text-gray-600">Preencha com detalhes para agilizarmos seu atendimento</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Restaurante <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="restaurantName"
                    name="restaurantName"
                    required
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Ex: Restaurante Delícia"
                  />
                </div>

                <div>
                  <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Responsável <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="responsibleName"
                    name="responsibleName"
                    required
                    value={formData.responsibleName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail de Contato <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="problemDomain" className="block text-sm font-medium text-gray-700 mb-1">
                    Domínio Afetado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="problemDomain"
                    name="problemDomain"
                    required
                    value={formData.problemDomain}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Ex: meurestaurante.websolutions.com"
                  />
                </div>
              </div>

              {/* Tipos de Problema */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo(s) de Problema/Requisição <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issueCategories.map((issue, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`issue-${index}`}
                          name="issueTypes"
                          type="checkbox"
                          value={issue}
                          checked={formData.issueTypes.includes(issue)}
                          onChange={handleIssueTypeChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`issue-${index}`} className="font-medium text-gray-700">
                          {issue}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.issueTypes.includes('Outros') && (
                  <div className="mt-4">
                    <label htmlFor="otherIssueDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Por favor, detalhe o problema "Outros"
                    </label>
                    <input
                      type="text"
                      id="otherIssueDescription"
                      name="otherIssueDescription"
                      value={formData.otherIssueDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Descreva o problema não listado acima"
                    />
                  </div>
                )}
              </div>

              {/* Descrição Detalhada */}
              <div>
                <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="problemDescription"
                  name="problemDescription"
                  rows={5}
                  required
                  value={formData.problemDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Descreva com detalhes o problema encontrado, incluindo:\n- Quando começou\n- Passos para reproduzir\n- Mensagens de erro (se houver)\n- Qualquer informação relevante"
                ></textarea>
              </div>

              {/* Urgência e Impacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="flex items-center h-5">
                    <input
                      id="isUrgent"
                      name="isUrgent"
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="isUrgent" className="block text-sm font-medium text-yellow-800">
                      Este é um problema urgente?
                    </label>
                    <p className="mt-1 text-sm text-yellow-700">
                      Marque apenas se precisar de resolução imediata (dentro de 2 horas).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="flex items-center h-5">
                    <input
                      id="isAffectingOperations"
                      name="isAffectingOperations"
                      type="checkbox"
                      checked={formData.isAffectingOperations}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="isAffectingOperations" className="block text-sm font-medium text-red-800">
                      Está afetando o funcionamento do restaurante?
                    </label>
                    <p className="mt-1 text-sm text-red-700">
                      Marque se o problema está impedindo operações normais.
                    </p>
                  </div>
                </div>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  Importante
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Caso precise enviar prints ou arquivos, aguarde nosso contato para orientações. Isso evita arquivos grandes no primeiro contato e agiliza a triagem do seu chamado.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Enviar Solicitação via WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                WebSolutions © {new Date().getFullYear()} - Todos os direitos reservados
              </p>
              <p className="text-sm text-gray-500 mt-2 md:mt-0">
                WhatsApp: +351 933 737 676
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalSupportForm;