import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { init, sendForm } from '@emailjs/browser';

init('-KTXIxP0JET7-dFK6');  


const PremiumSupportForm = () => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    ticketId: '',
    restaurantName: '',
    responsibleName: '',
    contactEmail: '',
    problemDomain: '',
    problemDescription: '',
    isUrgent: false,
    isAffectingOperations: false,
    issueTypes: [],
    otherIssueDescription: '',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Categorias de problemas
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

  // Gerar ticket ID ao carregar o componente
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ticketId: `TKT-${uuidv4().substring(0, 8).toUpperCase()}`
    }));
  }, []);

  // Manipuladores de eventos
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Gerar mensagem para WhatsApp
  const generateWhatsAppMessage = () => {
    const selectedIssues = formData.issueTypes.join(', ');
    const otherIssueText = formData.issueTypes.includes('Outros') 
      ? `\n*Detalhes do "Outros":* ${formData.otherIssueDescription}` 
      : '';

    return `*SOLICITAÇÃO DE SUPORTE PREMIUM - WebSolutions*\n\n` +
      `*Ticket ID:* ${formData.ticketId}\n` +
      `*Restaurante:* ${formData.restaurantName}\n` +
      `*Responsável:* ${formData.responsibleName}\n` +
      `*E-mail de contato:* ${formData.contactEmail}\n` +
      `*Domínio afetado:* ${formData.problemDomain}\n\n` +
      `*Tipo(s) de Problema(s):* ${selectedIssues}${otherIssueText}\n\n` +
      `*Descrição Detalhada:*\n${formData.problemDescription}\n\n` +
      `*Urgente:* ${formData.isUrgent ? '✅ Sim' : '❌ Não'}\n` +
      `*Afetando operações:* ${formData.isAffectingOperations ? '✅ Sim' : '❌ Não'}\n\n` +
      `*Observação:* Imagens foram enviadas por e-mail quando aplicável.`;
  };


const sendAlteracaoImagens = async (formData) => {
  const templateParams = {
    to_email:        'victor.engenhariasoftware@gmail.com',
    ticket_id:       formData.ticketId,
    restaurant_name: formData.restaurantName,
    contact_email:   formData.contactEmail,
    images:          formData.images,
    message:         `Solicitação de alteração de imagens para o ticket ${formData.ticketId}`
  };

  try {
    const response = await sendForm(
      'service_vwcg4so',    // Service ID
      'template_wrlcuhp',   // Template ID
      templateParams
    );
    console.log('✔️ E-mail enviado:', response.status, response.text);
    return response;
  } catch (err) {
    // log detalhado
    console.error('❌ Falha ao enviar e-mail:', err.status, err.text, err);
    throw err; // relança para o handleSubmit capturar
  }
};


const sendImagesByEmail = () => sendAlteracaoImagens(formData);

  // Enviar formulário
const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.issueTypes.length === 0) {
    alert('Por favor, selecione pelo menos um tipo de problema');
    return;
  }

  setIsSubmitting(true);

try {
  const templateParams = {
    to_email: formData.contactEmail,
    name: formData.responsibleName,          // para preencher {{name}} no template
    title: formData.problemDescription,      // para preencher {{title}} no template
    ticket_id: formData.ticketId,
    restaurant_name: formData.restaurantName,
    contact_email: formData.contactEmail,
    message: `Solicitação de alteração para o ticket ${formData.ticketId}`
  };

  await emailjs.send(
    'service_vwcg4so',
    'template_wrlcuhp',
    templateParams,
    '-KTXIxP0JET7-dFK6'
  );

    const whatsappMessage = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/351933737672?text=${encodedMessage}`, '_blank');

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        ticketId: `TKT-${uuidv4().substring(0, 8).toUpperCase()}`,
        restaurantName: '',
        responsibleName: '',
        contactEmail: '',
        problemDomain: '',
        problemDescription: '',
        isUrgent: false,
        isAffectingOperations: false,
        issueTypes: [],
        otherIssueDescription: '',
        images: []
      });
      setCurrentStep(1);
    }, 3000);
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    alert('Ocorreu um erro ao enviar seu formulário. Por favor, tente novamente.');
  } finally {
    setIsSubmitting(false);
  }
};

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const stepVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Cartão principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white"
                >
                  Suporte Premium WebSolutions
                </motion.h1>
                <motion.p 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-1 text-indigo-100"
                >
                  Sistema de Gestão para Restaurantes
                </motion.p>
              </div>
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 p-3 rounded-lg backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Indicador de progresso */}
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {step}
                  </button>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
              <div className="ml-4 text-sm text-gray-500">
                Ticket: <span className="font-mono font-bold text-indigo-600">{formData.ticketId}</span>
              </div>
            </div>
          </div>

          {/* Conteúdo do formulário */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Solicitação enviada com sucesso!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Seu ticket <span className="font-bold">{formData.ticketId}</span> foi registrado.
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Por favor, confirme o envio no WhatsApp que foi aberto.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  ref={formRef}
                  key="form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Passo 1 - Informações básicas */}
                  {currentStep === 1 && (
                    <motion.div
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-gray-800">Informações do Restaurante</h2>
                        <p className="mt-1 text-gray-600">Preencha os dados básicos para começarmos</p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { id: 'restaurantName', label: 'Nome do Restaurante', placeholder: 'Ex: Restaurante Delícia', required: true },
                          { id: 'responsibleName', label: 'Nome do Responsável', placeholder: 'Seu nome completo', required: true },
                          { id: 'contactEmail', label: 'E-mail de Contato', type: 'email', placeholder: 'seu@email.com', required: true },
                          { id: 'problemDomain', label: 'Domínio Afetado', placeholder: 'meurestaurante.websolutions.com', required: true }
                        ].map((field) => (
                          <motion.div key={field.id} variants={itemVariants}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type={field.type || 'text'}
                              id={field.id}
                              name={field.id}
                              required={field.required}
                              value={formData[field.id]}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                              placeholder={field.placeholder}
                            />
                          </motion.div>
                        ))}
                      </div>

                      <motion.div variants={itemVariants} className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                        >
                          Próximo
                          <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Passo 2 - Detalhes do problema */}
                  {currentStep === 2 && (
                    <motion.div
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-gray-800">Detalhes da Solicitação</h2>
                        <p className="mt-1 text-gray-600">Descreva o problema ou requisição</p>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Tipo(s) de Problema/Requisição <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {issueCategories.map((issue, index) => (
                            <motion.div 
                              key={index} 
                              variants={itemVariants}
                              whileHover={{ scale: 1.02 }}
                              className="flex items-start p-2 rounded-lg hover:bg-gray-50"
                            >
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
                            </motion.div>
                          ))}
                        </div>

                        {formData.issueTypes.includes('Outros') && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
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
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div variants={itemVariants}>
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
                      </motion.div>

                      {/* Upload de imagens (mostrar apenas se selecionou alteração de imagens) */}
                      {formData.issueTypes.includes('Alteração de imagens na plataforma') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enviar Imagens para Alteração
                            </label>
                            <div 
                              onClick={() => fileInputRef.current.click()}
                              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition duration-200"
                            >
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                    <span>Clique para enviar arquivos</span>
                                    <input
                                      ref={fileInputRef}
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      multiple
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                    />
                                  </label>
                                  <p className="pl-1">ou arraste e solte</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF até 10MB
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Pré-visualização das imagens */}
                          {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {formData.images.map((img, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="relative group"
                                >
                                  <img
                                    src={img}
                                    alt={`Preview ${index + 1}`}
                                    className="h-32 w-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                        >
                          <svg className="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                        >
                          Próximo
                          <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Passo 3 - Urgência e envio */}
                  {currentStep === 3 && (
                    <motion.div
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-gray-800">Prioridade e Confirmação</h2>
                        <p className="mt-1 text-gray-600">Informe a urgência e revise seus dados</p>
                      </motion.div>

                      <div className="space-y-4">
                        <motion.div 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-start space-x-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                        >
                          <div className="flex items-center h-5 pt-1">
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
                              Marque apenas se precisar de resolução imediata (dentro de 2 horas). Chamados urgentes podem ter custos adicionais.
                            </p>
                          </div>
                        </motion.div>

                        <motion.div 
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-start space-x-3 bg-red-50 p-4 rounded-lg border border-red-200"
                        >
                          <div className="flex items-center h-5 pt-1">
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
                              Marque se o problema está impedindo operações normais. Isso priorizará seu atendimento.
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div 
                        variants={itemVariants}
                        className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                      >
                        <h3 className="text-sm font-medium text-blue-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                          </svg>
                          Instruções Importantes
                        </h3>
                        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                          <li>Após enviar, uma janela do WhatsApp será aberta para confirmação</li>
                          {formData.issueTypes.includes('Alteração de imagens na plataforma') && (
                            <li>As imagens serão enviadas automaticamente para nosso time de design</li>
                          )}
                          <li>Seu Ticket ID é <span className="font-bold">{formData.ticketId}</span> - use para acompanhamento</li>
                          <li>O tempo médio de resposta é de 4 horas para chamados normais</li>
                        </ul>
                      </motion.div>

                      <div className="flex items-center justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                        >
                          <svg className="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          Voltar
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Enviar Solicitação via WhatsApp
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Rodapé */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                WebSolutions © {new Date().getFullYear()} - Todos os direitos reservados
              </p>
              <div className="flex items-center mt-2 md:mt-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+351933737672" className="text-sm text-gray-500 hover:text-indigo-600">+351 933 737 672</a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumSupportForm;