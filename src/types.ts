export interface ExternalUrls {
  spotify: string
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface Album {
  album_type: string
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface ExternalIds {
  isrc: string
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////     CurrentlyPlaying     //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

export interface Device {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
}

export interface Context {
  external_urls: ExternalUrls
  href: string
  type: string
  uri: string
}

export interface Item {
  album: Album
  artists: Artist[]
  available_markets: any[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url?: any
  track_number: number
  type: string
  uri: string
}

export interface Disallows {
  resuming: boolean
  skipping_prev: boolean
}

export interface Actions {
  disallows: Disallows
}

export interface CurrentlyPlaying {
  device: Device
  shuffle_state: boolean
  repeat_state: string
  timestamp: number
  context: Context
  progress_ms: number
  item: Item
  currently_playing_type: string
  actions: Actions
  is_playing: boolean
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////     Playlist     //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

export interface AddedBy {
  id: string
}

export interface Image {
  height: number
  url: string
  width: number
}

export interface Album {
  artists: Artist[]
  images: Image[]
  name: string
}

export interface Track {
  id: string
  album: Album
  duration_ms: number
  name: string
}

export interface PlaylistItem {
  added_by: AddedBy
  track: Track
}

export interface Playlist {
  items: PlaylistItem[]
}

// Function types
export interface FancyPlaylistProps {
  playlist: Playlist
  currentlyPlaying: CurrentlyPlaying
}

export interface CurrentlyPlayingProps {
  currentlyPlaying: CurrentlyPlaying
}

export interface PlayerProps {
  currentlyPlaying: CurrentlyPlaying
  isPlaying: boolean
}

export interface AddSongDialogProps {
  showAddSongDialog: boolean
  onDialogClose: Function
  onSongAdded: Function
}

export interface AppBarProps {
  authAndPlaylistDone: boolean
  onShowSongDialog: Function
  onThemeChanged: Function
  onFancyListChange: Function
  onContributorsChange: Function
  listeners: number
}

// User
export interface Followers {
  href?: string
  total: number
}

export interface User {
  display_name: string
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  images: Image[]
  type: string
  uri: string
}

export interface StatsProps {
  showDialog: boolean
  users: User[]
  onDialogClose: Function
  playlist: Playlist
}
