import { NFTStorage } from "nft.storage"
import { useCallback } from "react"

const useIPFS = () => {
  const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE as string })

  const getJSON = useCallback(async (cid: string) => {
    const res = await fetch(`https://nftstorage.link/ipfs/${cid}`)

    return await res.json()
  }, [])

  const getString = useCallback(async (cid: string) => {
    const res = await fetch(`https://nftstorage.link/ipfs/${cid}`)

    return await res.text()
  }, [])

  return { client, fetch: { getJSON, getString } }
}

export default useIPFS