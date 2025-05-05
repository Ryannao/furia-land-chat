# Landing Page com Chatbot e API

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen.svg)]

**Descrição**  
Uma landing page responsiva construída sobre o template Nextly, que integra um chatbot inteligente via API (Open Router), desenvolvida como teste para o processo seletivo de Assistente de Engenharia de Software na FURIA. Demonstra domínio de boas práticas de desenvolvimento web, Clean Code, validações e integração de serviços.

**Demonstração**  
- Frontend (Vercel): https://seu-usuario.vercel.app  
- API (OpenRouter): DeepSeek V3

**Funcionalidades**  
- Página responsiva (mobile‑first) baseada no template Nextly.  
- Chatbot com NLP básico para perguntas frequentes via Open Router.    
- Uso da library **linkify** para converter URLs em texto em links clicáveis.  

**Tecnologias**  
- **Template**: Nextly Landing Page Template  
- **Frontend**: Next.js, React, linkify  
- **Backend/API**: Node.js
- **Infraestrutura**: Vercel

**Requisitos**  
- Node.js ≥14  
- Conta gratuita no Open Router para obter chave de API  

**Execução da API**  
1. Crie uma conta no OpenRouter
2. Na janela de keys cria uma própria
3. Na página do projeto do vercel vá em settings>Environment Variables>Name "OPENROUTER_API_KEY">Value "sua key"