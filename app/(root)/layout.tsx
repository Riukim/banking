import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const loggedIn = await getLoggedInUser()

  if (!loggedIn) redirect("/sign-in")

  return (
    <main className="flex h-screen w-full font-inter bg-background">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Link
            href="/"
          >
            <Image
              src="icons/logo.svg"
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
  )
}
