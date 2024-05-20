import AuthForm from '@/components/AuthForm'
import React from 'react'
import TranslationProvider from "@/components/TranslationProvider"
import initTranslations from '@/app/i18n'

const i18nNamespaces = ["sign-up"]

const SignUp = async ({
  params: { locale },
}: {
  params: { locale: string }
}) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <TranslationProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <section className="flex-center size-full max-sm:px-6 bg-background">
        <AuthForm type="sign-up" />
      </section>
    </TranslationProvider>
  )
}

export default SignUp