/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import io from "socket.io-client"
import { CurrentlyPlaying, Playlist, User } from "../types"
import { apiUrl, formatDuration, getCode } from "../utils"

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  CssBaseline,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import FancyPlaylistComponent from "./FancyPlaylistComponent"
import SimplePlaylistComponent from "./SimplePlaylistComponent"
import DensePlaylistComponent from "./DensePlaylistComponent"
import PlayerComponent from "./PlayerComponent"
import LoginComponent from "./LoginComponent"
import AddSongDialogComponent from "./AddSongDialogComponent"
import AppBarComponent from "./AppBarComponent"
import StatsComponent from "./StatsComponent"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  accordionSummary: {
    "& > :nth-child(1)": {
      justifyContent: "flex-end",
    },
  },
  playlistContainer: {
    width: "100%",
  },
  menuIcon: {
    color: "white",
  },
}))

export default function App2() {
  const classes = useStyles()
  const [socket, setSocket] = useState<null | any>(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [code, setCode] = React.useState("")
  const [playlist, setPlaylist] = useState({} as Playlist)
  const [users, setUsers] = useState<User[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState({} as CurrentlyPlaying)
  const [isPlaying, setPlaying] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showAddSongDialog, setShowSongDialog] = React.useState(false)
  const [showContributorsDialog, setShowContributorsDialog] = React.useState(false)
  const [isSimpleList, setIsSimpleList] = React.useState(true)
  const [showPlaylist, setShowPlaylist] = React.useState(true)
  const [listeners, setListeners] = React.useState(0)

  // MAIN
  useEffect(() => {
    setSocket(io(apiUrl()))
    const storageShowPlaylist = localStorage.getItem("showPlaylist") ?? "true"
    const darkMode = localStorage.getItem("darkMode") ?? "true"
    setDarkMode(darkMode === "true")
    setShowPlaylist(storageShowPlaylist === "true")
    const code = getCode()
    if (code !== "") {
      setCode(code)
    }
  }, [])

  // [socket]
  useEffect(() => {
    if (!socket) return

    socket.on("connect", () => {
      setSocketConnected(socket.connected)
      if (code !== "") {
        socket.emit("code", code)
      }
    })
    socket.on("playlist", (playlist: Playlist) => {
      setPlaylist(playlist)
    })
    socket.on("currentlyPlaying", (currentlyPlaying: CurrentlyPlaying) => {
      setPlaying(currentlyPlaying?.is_playing ?? false)
      setCurrentlyPlaying(currentlyPlaying)
    })
    socket.on("users", (users: User[]) => {
      setUsers(users)
    })
    socket.on("listeners", (listeners: number) => {
      console.log("listeners:" + listeners)
      setListeners(listeners)
    })
    socket.on("disconnect", () => {
      setSocketConnected(socket.connected)
    })
  }, [socket])

  const darkTheme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  })

  const handleAddSongClick = () => setShowSongDialog(true)
  const handleClose = () => setShowSongDialog(false)
  const handleFancyListChange = () => {
    setIsSimpleList((isSimpleList) => !isSimpleList)
  }
  const handleOnShowPlaylist = () => {
    localStorage.setItem("showPlaylist", `${!showPlaylist}`)
    setShowPlaylist((showPlaylist) => !showPlaylist)
  }
  const handleOnSongAdded = async () => {
    socket.emit("playlist", code)
    handleClose()
  }
  const handleContributorsDialogClose = () => setShowContributorsDialog(false)

  const handleThemeChange = () => {
    localStorage.setItem("darkMode", `${!darkMode}`)
    setDarkMode((darkMode) => !darkMode)
  }

  const handleContributorsChanged = () => setShowContributorsDialog(true)

  const currentlyPlayingIsEmpty = () =>
    Object.keys(currentlyPlaying).length === 0 && currentlyPlaying.constructor === Object

  const getBody = () => {
    if (code === "" && currentlyPlayingIsEmpty()) {
      return <LoginComponent />
    } else {
      return (
        <main>
          <PlayerComponent isPlaying={isPlaying} currentlyPlaying={currentlyPlaying} />
          <Container maxWidth="md">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={12}>
                <Accordion expanded={showPlaylist} onChange={handleOnShowPlaylist}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    className={classes.accordionSummary}
                  >
                    <Typography>{showPlaylist ? "Hide playlist" : "Show playlist"}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className={classes.playlistContainer}>
                      {isSimpleList ? (
                        <SimplePlaylistComponent
                          playlist={playlist}
                          currentlyPlaying={currentlyPlaying}
                        />
                      ) : (
                        <FancyPlaylistComponent
                          playlist={playlist}
                          currentlyPlaying={currentlyPlaying}
                        />
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Container>
          <AddSongDialogComponent
            showAddSongDialog={showAddSongDialog}
            onDialogClose={handleClose}
            onSongAdded={handleOnSongAdded}
          />
          <StatsComponent
            users={users}
            showDialog={showContributorsDialog}
            onDialogClose={handleContributorsDialogClose}
            playlist={playlist}
          />
        </main>
      )
    }
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppBarComponent
          authAndPlaylistDone={!currentlyPlayingIsEmpty()}
          onFancyListChange={handleFancyListChange}
          onShowSongDialog={handleAddSongClick}
          onThemeChanged={handleThemeChange}
          onContributorsChange={handleContributorsChanged}
          listeners={listeners}
        />
        {getBody()}
      </ThemeProvider>
    </div>
  )
}
