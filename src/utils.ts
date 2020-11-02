import { HashParams } from "./types"

export const getHashParams = (): HashParams => {
  let hashParams: HashParams = { access_token: "", expires_in: "", state: "", token_type: "" }
  let e: any
  let r = /([^&;=]+)=?([^&;]*)/g
  let q = window.location.hash.substring(1)
  while ((e = r.exec(q))) {
    ;(hashParams as any)[e[1]] = decodeURIComponent(e[2])
  }
  return hashParams
}

export const formatDuration = (milliSeconds: number) => {
  const secs = milliSeconds / 1000
  return (~~(secs / 60) + "").padStart(2, "0") + ":" + (~~(((secs / 60) % 1) * 60) + "").padStart(2, "0")
}

export const getTrackProgress = (playedDuration: number, totalDuration: number): number => {
  if (playedDuration === null || totalDuration === null) {
    return 0
  }
  return (playedDuration / totalDuration) * 100
}
