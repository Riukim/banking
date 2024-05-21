import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import initTranslations from "@/app/i18n"
import TranslationsProvider from "@/components/TranslationProvider"

const i18nNamespaces = ["sidebar"]

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode,
  params: {locale: string}
}>) {
  const loggedIn = await getLoggedInUser()

  if (!loggedIn) redirect("/sign-in")
  
  const { resources } = await initTranslations(locale, i18nNamespaces)

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <main className="flex h-screen w-full font-inter bg-background">
        <Sidebar user={loggedIn} />

        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Link href="/">
              <Image
                src="/icons/logo.svg"
                alt="menu icon"
                width={30}
                height={30}
              />
            </Link>
            <div>
              <MobileNav user={loggedIn} />
            </div>
          </div>
          {children}
        </div>
      </main>
    </TranslationsProvider>
  )
}

