"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from "./CustomInput"
import { authFormSchema } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn, signUp } from "@/lib/actions/user.actions"
import PlaidLink from "./PlaidLink"
import { ModeToggle } from "./ModeToggle"
import { useTranslation } from "react-i18next"
import LanguageChanger from "./LanguageChanger"

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation(["sign-in", "sign-up"])

  const formSchema = authFormSchema(type)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      // Sign up with Appwrite & create a plaid link token

      if (type === "sign-up") {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        }

        const newUser = await signUp(userData)

        setUser(newUser)
      }

      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })

        if (response) router.push("/")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <div className="flex items-center gap-1">
          <Link
            className="flex cursor-pointer items-center gap-1"
            href="/"
          >
            <Image
              src="/icons/logo.svg"
              alt="Horizon logo"
              width={34}
              height={34}
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-highlight">
              Horizon
            </h1>
          </Link>
          <div className="flex flex-row gap-5 ml-auto">
            <ModeToggle />
            <LanguageChanger />
          </div>
        </div>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-header">
            {user
              ? t("linkAccount")
              : type === "sign-in"
              ? t("sign-in")
              : t("sign-up")}
            <p className="text-16 font-normal text-header">
              {user ? t("instruction") : t("description")}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink
            user={user}
            variant="primary"
          />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label={t("nameLabel")}
                      placeholder={t("firstName")}
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label={t("lastLabel")}
                      placeholder={t("lastName")}
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="address1"
                    label={t("addressLabel")}
                    placeholder={t("address")}
                  />

                  <CustomInput
                    control={form.control}
                    name="city"
                    label={t("cityLabel")}
                    placeholder={t("city")}
                  />

                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label={t("stateLabel")}
                      placeholder={t("state")}
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label={t("postalCodeLabel")}
                      placeholder={t("postalCode")}
                    />
                  </div>

                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label={t("birthLabel")}
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="Example: 1234"
                    />
                  </div>
                </>
              )}

              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder={t("emailPlaceholder")}
              />
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder={t("passwordPlaceholder")}
              />
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="form-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />{" "}
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    t("signButton")
                  ) : (
                    t("signButton")
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-header">
              {type === "sign-in" ? t("info") : t("info")}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? t("link") : t("link")}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm
