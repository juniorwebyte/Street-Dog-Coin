# Street Dog Coin Airdrop

Este é o repositório oficial do sistema de airdrop WebyteCoin, uma plataforma de distribuição de tokens gratuitos com suporte multi-chain e sistema de referral.

## Características

- Suporte para múltiplas redes blockchain (ERC20, BEP20, EVM)
- Sistema de referral com recompensas
- Interface responsiva e amigável
- Integração com carteiras Web3 (MetaMask, etc.)
- Contrato inteligente em Solidity para gerenciamento do airdrop

## Pré-requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)
- Git
- MetaMask ou outra carteira Web3 compatível

## Instalação e Configuração

1. Clone o repositório:
   \`\`\`
   git clone https://github.com/seu-usuario/streetdogcoin-airdrop.git
   cd streetdocoincoin-airdrop
   \`\`\`

2. Instale as dependências:
   \`\`\`
   npm install --legacy-peer-deps
   \`\`\`  
   \`\`\`
   npm install --force
   \`\`\`

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:
   \`\`\`
   NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM=seu_endereco_contrato_ethereum
   NEXT_PUBLIC_CONTRACT_ADDRESS_BSC=seu_endereco_contrato_bsc
   NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON=seu_endereco_contrato_polygon
   NEXT_PUBLIC_INFURA_ID=seu_id_infura
   \`\`\`

4. Atualize os seguintes arquivos com as informações específicas do seu token e airdrop:
   - `hooks/use-web3.ts`: Atualize os endereços do contrato para cada rede suportada.
   - `lib/airdrop.ts`: Ajuste as regras de elegibilidade e os valores do airdrop.
   - `app/page.tsx`: Personalize o texto e as instruções da página inicial.
   - `components/airdrop-stats.tsx`: Atualize as estatísticas do airdrop.
   - `components/timeline.tsx`: Ajuste o cronograma do airdrop.

5. Implante o contrato inteligente:
   - Use o Remix IDE ou o Truffle para implantar o contrato `StreetDogCoinAirdrop.sol` nas redes desejadas.
   - Atualize os endereços do contrato no arquivo `.env.local`.

6. Execute o projeto localmente:
   \`\`\`
   npm run dev
   \`\`\`

7. Acesse `http://localhost:3000` para visualizar a aplicação.

## Implantação

Para implantar em produção, recomendamos usar a Vercel:

1. Faça push do seu repositório para o GitHub.
2. Conecte seu repositório à Vercel.
3. Configure as variáveis de ambiente na Vercel.
4. Implante o projeto.

## Suporte

Para suporte, entre em contato conosco através das issues do GitHub ou pelo nosso canal no Telegram.
