import { HashParams } from "./types"

export const getHashParams = (): HashParams => {
  let hashParams: HashParams = {access_token: '',expires_in: '', state: '', token_type: ''}
  let e: any
  let r = /([^&;=]+)=?([^&;]*)/g
  let q = window.location.hash.substring(1)
  while ((e = r.exec(q))) {
    ;(hashParams as any)[e[1]] = decodeURIComponent(e[2])
  }
  return hashParams
}
