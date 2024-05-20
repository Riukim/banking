import AuthForm from '@/components/AuthForm'
import React from 'react'
import initTranslations from "@/app/i18n"
import TranslationProvider from "@/components/TranslationProvider"

const i18nNamespaces = ["sign-in"]

const SignIn = async ({
  params: { locale },
}: {
  params: { locale: string }
}) => {
  const { t, resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <TranslationProvider resources={resources} locale={locale} namespaces={i18nNamespaces}>
      <section className="flex-center size-full dark:border-r border-border bg-background max-sm:px-6">
        <AuthForm type="sign-in" />
      </section>
    </TranslationProvider>
  )
}

export default SignIn