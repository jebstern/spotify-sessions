import axios from "axios"
import { apiUrl } from "./utils"

const API_URL = apiUrl()

export async function playSongAtOffsetPosition(position: number): Promise<void> {
  axios.put(`${API_URL}/playSongAtOffsetPosition`, { position: position })
}

export async function shuffle(shuffle: boolean): Promise<any> {
  await axios.put(`${API_URL}/shuffle`, { shuffle })
}

export async function play(): Promise<any> {
  console.log("url:" + apiUrl())
  await axios.get(`${API_URL}/play`).catch((error) => console.log("play ERROR! " + error.message))
}

export async function pause(): Promise<any> {
  await axios.get(`${API_URL}/pause`).catch((error) => console.log("pause ERROR! " + error.message))
}

export async function next(): Promise<any> {
  await axios.get(`${API_URL}/next`).catch((error) => console.log("next ERROR! " + error.message))
}

export async function previous(): Promise<any> {
  await axios.get(`${API_URL}/previous`).catch((error) => console.log("previous ERROR! " + error.message))
}

export async function add(trackURI: string): Promise<any> {
  axios.post(`${API_URL}/add`, { trackURI })
}
