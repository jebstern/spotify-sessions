/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { CurrentlyPlaying, Playlist } from "../types"
import { getHashParams } from "../utils"
import * as api from "../api"
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
import PlayerComponent from "./PlayerComponent"
import LoginComponent from "./LoginComponent"
import SetPlaylistIdComponent from "./SetPlaylistIdComponent"
import AddSongDialogComponent from "./AddSongDialogComponent"
import AppBarComponent from "./AppBarComponent"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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

export default function Album() {
  const classes = useStyles()
  const [darkMode, setDarkMode] = useState(false)
  const [playlistId, setPlaylistId] = React.useState("")
  const [accessToken, setAccessToken] = React.useState("")
  const [playlist, setPlaylist] = useState({} as Playlist)
  const [currentlyPlaying, setCurrentlyPlaying] = useState({} as CurrentlyPlaying)
  const [seconds, setSeconds] = useState(0)
  const [isPlaying, setPlaying] = useState(true)
  const [showAddSongDialog, setShowSongDialog] = React.useState(false)
  const [isSimpleList, setIsSimpleList] = React.useState(true)
  const [showPlaylist, setShowPlaylist] = React.useState(true)

  const authAndPlaylistDone = () => playlistId !== "" && accessToken !== ""
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
    getPlaylist()
    handleClose()
  }
  const handleOnPlaylistIdSet = (id: string) => {
    console.log("handleOnPlaylistIdSet")
    console.log("id:" + id)
    if (id === "") {
      return
    }
    localStorage.setItem("playlistId", id)
    setPlaylistId(id)
  }
  const handleThemeChange = () => {
    localStorage.setItem("darkMode", `${!darkMode}`)
    setDarkMode((darkMode) => !darkMode)
  }

  const darkTheme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  })

  const getPlaylist = () => {
    if (!authAndPlaylistDone()) {
      return
    }
    api.playlist(accessToken, playlistId).then((playlist) => setPlaylist(playlist))
  }

  useEffect(() => {
    setPlaylistId(localStorage.getItem("playlistId") ?? "")
    const storageShowPlaylist = localStorage.getItem("showPlaylist") ?? "true"
    const darkMode = localStorage.getItem("darkMode") ?? "true"
    setDarkMode(darkMode === "true")
    setShowPlaylist(storageShowPlaylist === "true")
    const hashParams = getHashParams()
    if (hashParams.access_token && hashParams.access_token !== "") {
      setAccessToken(hashParams.access_token)
    }
    getPlaylist()
  }, [])

  const getCurrentlyPlayingData = () => {
    if (!authAndPlaylistDone()) {
      return
    }
    if (Object.keys(playlist).length === 0 && playlist.constructor === Object) {
      getPlaylist()
    }

    api.currentlyPlaying(accessToken).then((response: CurrentlyPlaying) => {
      setPlaying(response?.is_playing ?? false)
      setCurrentlyPlaying(response)
    })
  }

  useEffect(() => {
    let interval: any = null
    interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1)
    }, 1000)
    getCurrentlyPlayingData()
    return () => clearInterval(interval)
  }, [seconds])

  const getBody = () => {
    if (accessToken === "") {
      return <LoginComponent />
    } else if (playlistId === "") {
      return <SetPlaylistIdComponent onPlaylistSet={handleOnPlaylistIdSet} />
    } else {
      return (
        <main>
          <PlayerComponent isPlaying={isPlaying} accessToken={accessToken} currentlyPlaying={currentlyPlaying} />
          <Container className={classes.cardGrid} maxWidth="md">
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
                          accessToken={accessToken}
                          playlistId={playlistId}
                        />
                      ) : (
                        <FancyPlaylistComponent
                          playlist={playlist}
                          currentlyPlaying={currentlyPlaying}
                          accessToken={accessToken}
                          playlistId={playlistId}
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
            accessToken={accessToken}
            playlistId={playlistId}
            onDialogClose={handleClose}
            onSongAdded={handleOnSongAdded}
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
          authAndPlaylistDone={playlistId !== "" && accessToken !== ""}
          onFancyListChange={handleFancyListChange}
          onShowSongDialog={handleAddSongClick}
          onThemeChanged={handleThemeChange}
        />
        {getBody()}
      </ThemeProvider>
    </div>
  )
}
