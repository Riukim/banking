import React, { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { PlaidLinkOnSuccess, PlaidLinkOptions } from "react-plaid-link"
import { useRouter } from "next/navigation"

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter()
  const [token, setToken] = useState("")

  useEffect(() => {
    const getLinkToken = async () => {
      /* const data = await createLinkToken(user) */

      /* setToken(data?.linkToken) */
    }

    getLinkToken()
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
      /*await excahangePublicToken({
      publicToken: public_token,
      user
    }) */

    router.push("/")
  }, [user])

  const config: PlaidLinkOptions = {
    token,
    onSuccess
  }

  return (
    <>
      {variant === "primary" ? (
        <Button
          
          className="plaidlink-primary"
        >
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
          <Button>
            Connect Bank
          </Button>
      ) : (
            <Button>
              Connect Bank
            </Button>
      )}
    </>
  )
}

export default PlaidLink
