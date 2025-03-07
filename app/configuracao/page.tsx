"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Server, Code, Cog, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/hooks/use-web3"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

export default function ConfiguracaoPage() {
  const [activeTab, setActiveTab] = useState("setup")
  const { address, disconnect } = useWeb3()
  const { language } = useLanguage()

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-4xl relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-6 text-center text-white pulsate"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {getTranslation(language, "configurationTitle")}
      </motion.h1>

      {address && (
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground mb-2">{getTranslation(language, "connectedAs")}</p>
          <p className="font-mono text-sm mb-2">{address}</p>
          <Button variant="outline" onClick={disconnect}>
            {getTranslation(language, "disconnectWallet")}
          </Button>
        </motion.div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="setup">{getTranslation(language, "setup")}</TabsTrigger>
            <TabsTrigger value="changelog">{getTranslation(language, "changelog")}</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="setup">
          <SetupInstructions language={language} />
        </TabsContent>

        <TabsContent value="changelog">
          <Changelog language={language} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function SetupInstructions({ language }: { language: string }) {
  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Alert className="mb-6 bg-opacity-80 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{getTranslation(language, "important")}</AlertTitle>
        <AlertDescription>{getTranslation(language, "setupInstructions")}</AlertDescription>
      </Alert>

      <ConfigSection
        title={getTranslation(language, "environmentPreparation")}
        icon={Cog}
        steps={[
          getTranslation(language, "installNodejs"),
          getTranslation(language, "installGit"),
          getTranslation(language, "createGithubAccount"),
          getTranslation(language, "installMetamask"),
        ]}
      />

      <ConfigSection
        title={getTranslation(language, "smartContractSetup")}
        icon={Code}
        steps={[
          getTranslation(language, "openContractFile"),
          getTranslation(language, "useRemixIDE"),
          getTranslation(language, "deployContract"),
          getTranslation(language, "noteContractAddress"),
        ]}
      />

      <ConfigSection
        title={getTranslation(language, "applicationSetup")}
        icon={Cog}
        steps={[
          getTranslation(language, "cloneRepository"),
          getTranslation(language, "installDependencies"),
          getTranslation(language, "setupEnvironmentVariables"),
          getTranslation(language, "updateContractAddresses"),
          getTranslation(language, "customizeHomepage"),
          getTranslation(language, "adjustEligibilityRules"),
          getTranslation(language, "buildApplication"),
          getTranslation(language, "testLocally"),
        ]}
      />

      <ConfigSection
        title={getTranslation(language, "productionDeployment")}
        icon={Server}
        steps={[
          getTranslation(language, "createVercelAccount"),
          getTranslation(language, "connectGithubToVercel"),
          getTranslation(language, "configureEnvironmentVariables"),
          getTranslation(language, "deployToVercel"),
          getTranslation(language, "setupCustomDomain"),
        ]}
      />

      <ConfigSection
        title={getTranslation(language, "finalSetupAndLaunch")}
        icon={Rocket}
        steps={[
          getTranslation(language, "verifyContractSetup"),
          getTranslation(language, "testAllFunctionalities"),
          getTranslation(language, "configureAirdropDates"),
          getTranslation(language, "prepareMarketingMaterials"),
          getTranslation(language, "officiallyLaunchAirdrop"),
          getTranslation(language, "provideUserSupport"),
        ]}
      />

      <Alert className="mt-8 bg-opacity-80 backdrop-blur-sm">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>{getTranslation(language, "readyToLaunch")}</AlertTitle>
        <AlertDescription>{getTranslation(language, "readyToLaunchDescription")}</AlertDescription>
      </Alert>
    </motion.div>
  )
}

function Changelog({ language }: { language: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-opacity-80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{getTranslation(language, "changelog")}</CardTitle>
          <CardDescription>{getTranslation(language, "changelogDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <strong>v1.3.0 (10/03/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>{getTranslation(language, "addedGalaxyBackground")}</li>
                <li>{getTranslation(language, "improvedAnimations")}</li>
                <li>{getTranslation(language, "addedMultiLanguageSupport")}</li>
                <li>{getTranslation(language, "updatedDocumentation")}</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <strong>v1.2.0 (06/03/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>{getTranslation(language, "addedMultiChainSupport")}</li>
                <li>{getTranslation(language, "implementedReferralSystem")}</li>
                <li>{getTranslation(language, "improvedUIAndAnimations")}</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <strong>v1.1.0 (15/02/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>{getTranslation(language, "integratedSocialMediaVerification")}</li>
                <li>{getTranslation(language, "addedConfigurationPage")}</li>
                <li>{getTranslation(language, "bugFixesAndPerformanceImprovements")}</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <strong>v1.0.0 (01/01/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>{getTranslation(language, "initialRelease")}</li>
                <li>{getTranslation(language, "basicTokenClaiming")}</li>
                <li>{getTranslation(language, "responsiveUserInterface")}</li>
              </ul>
            </motion.li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ConfigSection({ title, icon: Icon, steps }: { title: string; icon: any; steps: string[] }) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-opacity-80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                className="text-white"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {step}
              </motion.li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  )
}

