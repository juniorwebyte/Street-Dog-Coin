export const translations = {
  en: {
    connectWallet: "Connect Wallet",
    airdropStats: "Airdrop Stats",
    totalTokens: "Total Tokens",
    claimedTokens: "Claimed Tokens",
    participants: "Participants",
    remainingDays: "Remaining Days",
    configurationTitle: "Street Dog Coin Airdrop Configuration",
    connectedAs: "Connected as:",
    disconnectWallet: "Disconnect Wallet",
    setup: "Setup",
    changelog: "Changelog",
    important: "Important",
    setupInstructions:
      "Follow this step-by-step guide to set up and deploy the Street Dog Coin airdrop system. Make sure to follow each step carefully to ensure correct configuration.",
    environmentPreparation: "1. Environment Preparation",
    installNodejs: "Install Node.js (version 14 or higher) and npm on your machine.",
    installGit: "Install Git to clone the repository.",
    createGithubAccount: "Create a GitHub account if you don't have one.",
    installMetamask: "Install MetaMask or another Web3 compatible wallet in your browser.",
    smartContractSetup: "2. Smart Contract Setup",
    openContractFile: "Open the contracts/StreetDogCoinAirdrop.sol file and adjust the airdrop parameters as needed.",
    useRemixIDE: "Use Remix IDE (https://remix.ethereum.org/) to compile and deploy the contract.",
    deployContract: "Deploy the contract on the desired network (Ethereum, BSC, Polygon) using MetaMask.",
    noteContractAddress: "Note down the deployed contract address for each network.",
    applicationSetup: "3. Application Setup",
    cloneRepository: "Clone the GitHub repository: git clone https://github.com/your-username/streetdogcoin-airdrop.git",
    installDependencies: "Navigate to the project directory and install dependencies: npm install",
    setupEnvironmentVariables:
      "Create a .env.local file in the project root and add the necessary environment variables",
    updateContractAddresses: "Update the hooks/use-web3.ts file with the correct contract addresses for each network.",
    customizeHomepage: "Customize the app/page.tsx file with your token and airdrop specific information.",
    adjustEligibilityRules: "Adjust the eligibility rules in the lib/airdrop.ts file if necessary.",
    buildApplication: "Build the application: npm run build",
    testLocally: "Test locally with npm run start and access http://localhost:3000",
    productionDeployment: "4. Production Deployment",
    createVercelAccount: "Create a Vercel account (https://vercel.com) if you don't have one.",
    connectGithubToVercel: "Connect your GitHub repository to Vercel.",
    configureEnvironmentVariables: "Configure the environment variables in Vercel (same as in .env.local file).",
    deployToVercel: "Deploy the project to Vercel.",
    setupCustomDomain: "Set up a custom domain, if desired.",
    finalSetupAndLaunch: "5. Final Setup and Launch",
    verifyContractSetup: "Verify that the contract is correctly set up and funded with tokens.",
    testAllFunctionalities: "Test all airdrop functionalities in a production environment.",
    configureAirdropDates: "Configure the start and end dates of the airdrop in the smart contract.",
    prepareMarketingMaterials: "Prepare marketing materials and announcements for the airdrop launch.",
    officiallyLaunchAirdrop: "Officially launch the airdrop and monitor activity.",
    provideUserSupport: "Provide support to users through established communication channels.",
    readyToLaunch: "Ready to Launch!",
    readyToLaunchDescription:
      "After following all these steps, your Street Dog Coin airdrop will be configured and ready to launch. Remember to constantly monitor performance and provide support to participants.",
    changelog: "Changelog",
    changelogDescription: "Street Dog Coin Airdrop Update History",
    addedGalaxyBackground: "Added animated galaxy background with cosmic elements",
    improvedAnimations: "Improved UI animations and effects",
    addedMultiLanguageSupport: "Added support for multiple languages (EN, PT-BR, ES, FR)",
    updatedDocumentation: "Updated documentation and configuration instructions",
    addedMultiChainSupport: "Added support for multiple blockchain networks",
    implementedReferralSystem: "Implemented referral system",
    improvedUIAndAnimations: "Improved user interface and animations",
    integratedSocialMediaVerification: "Integrated Twitter and Telegram for task verification",
    addedConfigurationPage: "Added detailed configuration page",
    bugFixesAndPerformanceImprovements: "Bug fixes and performance improvements",
    initialRelease: "Initial release of Street Dog Coin Airdrop",
    basicTokenClaiming: "Basic support for token claiming",
    responsiveUserInterface: "Responsive user interface",
    connectWalletMessage: "Please connect your wallet to view the airdrop statistics.",
    connectWalletError: "Please connect your wallet to view airdrop statistics.",
    web3Error: "Web3 instance not initialized.",
    networkError: "Network ID not identified.",
    contractAddressError: "Contract address not found for this network",
    unknownError: "Unknown error loading statistics",
    error: "Error",
  },
  pt: {
    // Add Portuguese translations here
  },
  es: {
    // Add Spanish translations here
  },
  fr: {
    // Add French translations here
  },
}

export type Language = keyof typeof translations

export function getTranslation(lang: Language, key: keyof (typeof translations)["en"]) {
  return translations[lang][key] || translations["en"][key]
}

export function detectLanguage(): Language {
  if (typeof navigator === "undefined") return "en"

  const browserLang = navigator.language.split("-")[0]
  return (browserLang in translations ? browserLang : "en") as Language
}

