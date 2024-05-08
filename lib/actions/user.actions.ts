"use server"

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"

import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource } from "./dwolla.actions"

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env

export const signIn = async ({email, password}: signInProps) => {
  try {
    const { account } = await createAdminClient()

    const response = await account.createEmailPasswordSession(email, password)

    return parseStringify(response)

  } catch (error) {
    console.log("Error ", error)
  }
}

export const signUp = async (userData: SignUpParams) => {
  const {email, password, firstName, lastName} = userData

  try {
    // Create user account
    const { account } = await createAdminClient()

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    )

    const session = await account.createEmailPasswordSession(email, password)

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })

    return parseStringify(newUserAccount)
  } catch (error) {
    console.log("Error ", error)
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient()

    const user = await account.get()

    return parseStringify(user)
  } catch (error) {
    return null
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient()
    
    cookies().delete("apprwite-session")

    await account.deleteSession("current")
  } catch (error) {
    return null
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[]
    }

    const response = await plaidClient.linkTokenCreate(tokenParams)

    return parseStringify({linkToken: response.data.link_token})
  } catch (error) {
    console.log("Error", error);
  }
}

// Create bank account as document in our database
export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient()
    
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount)
  } catch (error) {
    
  }
}

export const exchangePublicToken = async({
  publicToken,
  user
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    })

    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    // Get account information from Plaid using access token
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken
    })

    const accountData = accountResponse.data.accounts[0]

    // Creatre a processor token for Dwolla using access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
    }

    const processorTokenResponse = await plaidClient.processorTokenCreate(request)
    const processorToken = processorTokenResponse.data.processor_token

    // Create funding source URL for the account using the Dwolla custmore ID,
    // processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name
    })

    // If the funding source URL is not created, throw a new error
    if (!fundingSourceUrl) throw Error

    // Create a bank account using the user ID, item ID, account ID, access token
    // funding source URL, shareable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id)
    })

    // Rvalidate path to reflect the changes
    revalidatePath("/")

    // Return success message
    return parseStringify({
      publicTokenExchange: "complete"
    })
  } catch (error) {
    console.log("An error occured while creating exchange token",error);
    
  }
}