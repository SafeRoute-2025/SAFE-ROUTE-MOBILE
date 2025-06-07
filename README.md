# 📱 SafeRoute Mobile

Aplicativo mobile do sistema SafeRoute, desenvolvido em **React Native**, com foco em **segurança, monitoramento de riscos e gerenciamento de locais seguros e recursos emergenciais**.

Este app é parte da solução integrada com backend em Java Spring Boot, e permite aos usuários visualizarem, cadastrarem e gerenciarem dados de eventos extremos, alertas, recursos e locais seguros.

---

## 🚀 Funcionalidades

- ✅ Login e Registro de Usuário
- ✅ Visualização dos eventos recentes
- ✅ Listagem e gerenciamento de:
  - Eventos (com tipo, risco, localização)
  - Alertas
  - Locais Seguros
  - Recursos disponíveis em cada local seguro
- ✅ Filtro e pesquisa por nome
- ✅ Modal para criação e edição de dados
- ✅ Integração com API REST Java Spring Boot
- ✅ Dica de segurança por IA (exemplo estático)
- ✅ Logout com redirecionamento para login

---

## 📷 Telas do App

- Tela de Login
- Tela de Registro
- Tela Inicial com cards de acesso rápido
- Eventos (listagem, criação e edição via modal)
- Alertas (listagem e exclusão)
- Locais Seguros
- Recursos por Local Seguro (com dropdowns dinâmicos)

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Axios](https://axios-http.com/)
- [react-native-dropdown-picker](https://github.com/hossein-zare/react-native-dropdown-picker)
- [react-navigation](https://reactnavigation.org/)
- [Expo Vector Icons](https://icons.expo.fyi/)
- Backend Java com Spring Boot (API em `/api`)

---

## ⚙️ Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/SafeRoute-2025/SAFE-ROUTE-MOBILE
cd SAFE-ROUTE-MOBILE
````

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar no Expo (ou diretamente no dispositivo/emulador)

```bash
npx expo start
```

> 🟡 Certifique-se de que o backend esteja rodando e acessível na mesma rede local.  -> [Repositorio Backend Java](https://github.com/SafeRoute-2025/SAFE-ROUTE-JAVA)

---

## 🔗 Endpoints Utilizados

* `POST /api/users/login` – Login personalizado
* `POST /api/users` – Registro
* `GET /api/events`
* `GET /api/alerts`
* `GET /api/safe-places`
* `GET /api/resources/by-safe-place/{id}`
* `GET /api/event-types/list`
* `GET /api/risk-levels/list`
* `GET /api/resource-types`
* `POST /api/resources`
* `PUT /api/resources/{id}`
* `DELETE /api/resources/{id}`

---

## 👤 Autenticação

* O login é validado apenas via `status 200`, sem uso de JWT.
* Após login bem-sucedido, o app redireciona para a navegação principal (`MainTabs`).
* O botão de logout está disponível na Home, parte superior direita.

---

## 📁 Estrutura de Pastas

```
src/
├── screens/
│   ├── HomeScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── EventsScreen.js
│   ├── AlertsScreen.js
│   ├── SafePlacesScreen.js
│   └── ResourcesScreen.js
├── services/
│   ├── api.js
│   ├── alertService.js
│   ├── eventService.js
│   ├── safePlaceService.js
│   ├── resourceService.js
│   └── resourceTypeService.js
├── navigation/
│   └── AppNavigator.js
├── styles/
│   └── globalstyles.js
App.js
```

---

## 📦 To-Do Futuro

* Integração com dicas geradas por IA em tempo real
* Controle de acesso com tipos de usuário (ex: Admin, Usuário comum)
* Validação de sessão entre telas

---

## 👥 Autores
- Mauricio Pereira - RM553748 - [GitHub](https://github.com/Mauricio-Pereira)
- Luiz Otávio Leitão Silva - RM553542 - [GitHub](https://github.com/Luiz1614)
- Vitor de Melo - RM553483 - [GitHub](https://github.com/vitor52a1)

---

## 📄 Licença
Projeto acadêmico - FIAP Global Solution 2025

