export const getCode = (): string => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get("code")
  return code ?? ""
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

export const apiUrl = () =>
  process.env.NODE_ENV === "production" ? "https://spotify-session-be.herokuapp.com" : "http://192.168.10.38:3001"
