import axios from "axios"

export async function currentlyPlaying(accessToken: string): Promise<any> {
  return axios
    .get("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
}

export async function playlist(accessToken: string, playlistId: string): Promise<any> {
  return axios
    .get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(added_by.id%2Ctrack(id%2Cduration_ms%2Cname%2Calbum(name%2C%20images%2Cartists)))`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => response.data)
}

export async function playSongAtOffsetPosition(position: number, accessToken: string, playlistId: string): Promise<any> {
  return axios.put(
    "https://api.spotify.com/v1/me/player/play",
    {
      context_uri: `spotify:playlist:${playlistId}`,
      offset: {
        position: position,
      },
      position_ms: 0,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export async function shuffle(shuffle: boolean, accessToken: string): Promise<any> {
  return axios.put(
    `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export async function play(accessToken: string): Promise<any> {
  return axios.put(
    "https://api.spotify.com/v1/me/player/play",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export async function pause(accessToken: string): Promise<any> {
  return axios.put(
    "https://api.spotify.com/v1/me/player/pause",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export async function next(accessToken: string): Promise<any> {
  return axios.post(
    "https://api.spotify.com/v1/me/player/next",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export async function previous(accessToken: string): Promise<any> {
  return axios.post(
    "https://api.spotify.com/v1/me/player/previous",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}

export async function add(trackURI: string, accessToken: string, playlistId: string): Promise<any> {
  return axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackURI}`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
}
