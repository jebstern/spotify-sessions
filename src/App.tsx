/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react"
import { CurrentlyPlaying, PlaylistItem, Playlist } from "./types"
import { getHashParams } from "./utils"
import * as api from "./api"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Grid,
  LinearProgress,
  makeStyles,
  Switch,
  TextField,
  Toolbar,
  Typography,
  TextFieldProps,
} from "@material-ui/core"
import { ExpandMore, Pause, PlayArrow, Shuffle, SkipNext, SkipPrevious } from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  addPlaylistContainer: {
    display: "flex",
    "& > :nth-child(2)": {
      marginLeft: 22,
    },
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  currentlyPlayingProgress: {
    margin: "16px auto",
    width: 302,
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(5, 1),
  },
  heroButtons: {
    marginTop: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },
  cardBackgroundGreen: {
    backgroundColor: "#00c333",
  },
  cardBackgroundWhite: {
    backgroundColor: "#fafafa",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  listRoot: {
    "& > *": {
      padding: 12,
    },
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1, 0),
    borderTop: "1px dashed",
  },
  addedBy: {
    fontStyle: "italic",
    fontSize: 14,
  },
  accordionSummary: {
    "& > :nth-child(1)": {
      justifyContent: "flex-end",
    },
  },
}))

export default function Album() {
  const classes = useStyles()
  const playlistIdRef = useRef<TextFieldProps>(null)

  const [playlistId, setPlaylistId] = React.useState("")
  const [accessToken, setAccessToken] = React.useState("")
  const [playlist, setPlaylist] = useState({} as Playlist)
  const [currentlyPlaying, setCurrentlyPlaying] = useState({} as CurrentlyPlaying)
  const [seconds, setSeconds] = useState(0)
  const [isPlaying, setPlaying] = useState(true)
  const [open, setOpen] = React.useState(false)
  const [addSong, setSongLink] = React.useState("")
  const [isSimpleList, setIsSimpleList] = React.useState(true)
  const [showPlaylist, setShowPlaylist] = React.useState(true)

  const handleFancyListChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSimpleList(event.target.checked)
  }
  const handleLogIn = () => {
    const client_id = "dfd70e3e1fcf46459825d3fb4dac11f7"
    const redirect_uri =
      process.env.NODE_ENV === "production" ? "https://spotify-session.herokuapp.com" : "http://localhost:3000"
    const scope =
      "user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private"
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=token&state=123`
  }

  const authAndPlaylistDone = () => playlistId !== "" && accessToken !== ""

  const handleClickOpen = () => setOpen(true)
  const handlePrevious = () => api.previous(accessToken)
  const handleNext = () => api.next(accessToken)
  const handlePlayOrPause = () => (isPlaying ? api.pause(accessToken) : api.play(accessToken))
  const handleClose = () => setOpen(false)
  const handleOnShuffleClicked = () => api.shuffle(!currentlyPlaying.shuffle_state, accessToken)
  const handleOnShowPlaylist = () => {
    localStorage.setItem("showPlaylist", `${!showPlaylist}`)
    setShowPlaylist((showPlaylist) => !showPlaylist)
  }
  const handleOnSongAdded = async () => {
    let uri = "spotify:track:" + addSong.substring(31, 53)
    await api.add(uri, accessToken, playlistId)
    getPlaylist()
    setOpen(false)
  }
  const onSongLinkChanged = (link: any) => setSongLink(link.target.value)
  const handleOnPlaylistIdSet = () => {
    const id: string = playlistIdRef?.current?.value as string
    if (id === "") {
      return
    }
    localStorage.setItem("playlistId", id)
    setPlaylistId(id)
  }

  const getPlaylist = () => {
    if (!authAndPlaylistDone()) {
      return
    }
    api.playlist(accessToken, playlistId).then((playlist) => setPlaylist(playlist))
  }

  useEffect(() => {
    setPlaylistId(localStorage.getItem("playlistId") ?? "")
    const storageShowPlaylist = localStorage.getItem("showPlaylist") ?? "true"
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

  const formatDuration = (milliSeconds: number) => {
    const secs = milliSeconds / 1000
    return (~~(secs / 60) + "").padStart(2, "0") + ":" + (~~(((secs / 60) % 1) * 60) + "").padStart(2, "0")
  }

  const getFancyPlaylistItems = () => {
    if (playlist.items == null) {
      return <div></div>
    }
    const output = playlist.items.map((playlistItem: PlaylistItem, index: number) => {
      var currentlyPlayingTrackId = currentlyPlaying?.item?.id ?? "1"
      return (
        <Grid item key={index} xs={12} sm={6} md={3}>
          <Card
            className={`${classes.card} ${
              currentlyPlayingTrackId === playlistItem.track.id
                ? classes.cardBackgroundGreen
                : classes.cardBackgroundWhite
            }`}
            elevation={16}
          >
            <CardMedia
              className={classes.cardMedia}
              image={playlistItem.track.album.images[0].url}
              title="Image title"
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="body2">
                {playlistItem.track.album.artists[0].name} - {playlistItem.track.name} (
                {formatDuration(playlistItem.track.duration_ms)})
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {playlistItem.added_by.id}
              </Typography>
              {currentlyPlayingTrackId === playlistItem.track.id && (
                <LinearProgress variant="determinate" value={getTrackProgress()} />
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="secondary"
                onClick={(_) => api.playSongAtOffsetPosition(index, accessToken, playlistId)}
              >
                Play
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )
    })
    return (
      <Grid container spacing={4}>
        {output}
      </Grid>
    )
  }

  const getCurrentlyPlaying = () => {
    if (currentlyPlaying == null || currentlyPlaying === undefined || currentlyPlaying.item === undefined) {
      return <span>No playback</span>
    }

    return (
      <span>
        <span>
          {currentlyPlaying.item.artists[0].name} - {currentlyPlaying.item.name}
          &nbsp;
        </span>
        <br />
        {formatDuration(currentlyPlaying.progress_ms)}/{formatDuration(currentlyPlaying.item.duration_ms)}
      </span>
    )
  }

  const getTrackProgress = (): number =>
    currentlyPlaying.item == null ? 0 : (currentlyPlaying.progress_ms / currentlyPlaying.item.duration_ms) * 100

  const getSimplePlaylistItems = () => {
    if (playlist.items == null) {
      return <div></div>
    }
    const output = playlist.items.map((playlistItem: PlaylistItem, index: number) => {
      var currentlyPlayingTrackId = currentlyPlaying?.item?.id ?? "1"
      return (
        <div
          key={index}
          className={`${classes.listRoot} ${
            currentlyPlayingTrackId === playlistItem.track.id
              ? classes.cardBackgroundGreen
              : classes.cardBackgroundWhite
          }`}
        >
          <img src={playlistItem.track.album.images[0].url} alt="asd" width="60" />

          <Button
            size="medium"
            color="secondary"
            onClick={(_) => api.playSongAtOffsetPosition(index, accessToken, playlistId)}
          >
            Play
          </Button>

          <span>
            {playlistItem.track.album.artists[0].name} - {playlistItem.track.name} (
            {formatDuration(playlistItem.track.duration_ms)})
            <br />
            <span className={classes.addedBy}>{playlistItem.added_by.id}</span>
            {currentlyPlayingTrackId === playlistItem.track.id && (
              <LinearProgress variant="determinate" value={getTrackProgress()} />
            )}
          </span>
        </div>
      )
    })

    return <div>{output}</div>
  }

  const getBody = () => {
    if (accessToken === "") {
      return (
        <main>
          <div className={classes.heroContent}>
            <Container maxWidth="md">
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="h3">You need to log in first!</Typography>
                  <Typography variant="body1">This app won't work unless you log in to Spotify</Typography>
                  <br />
                  <Button variant="contained" color="primary" onClick={handleLogIn}>
                    Log in
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </div>
        </main>
      )
    } else if (playlistId === "") {
      return (
        <main>
          <div className={classes.heroContent}>
            <Container maxWidth="md">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="h3">Insert session playlist</Typography>
                  <Typography variant="body1">
                    Write down the collaborative playlist, which you want to share with your friends.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7} md={6} className={classes.addPlaylistContainer}>
                  <TextField
                    inputRef={playlistIdRef}
                    label="Playlist id"
                    variant="outlined"
                    autoFocus
                    id="playlist-id"
                    type="text"
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  md={6}
                  className={classes.addPlaylistContainer}
                  onClick={handleOnPlaylistIdSet}
                >
                  <Button variant="contained" color="primary" size="small">
                    Set
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </div>
        </main>
      )
    } else {
      return (
        <main>
          <div className={classes.heroContent}>
            <Container maxWidth="md">
              <Typography variant="h6" className={classes.title}>
                {getCurrentlyPlaying()}
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button
                      variant={currentlyPlaying != null && currentlyPlaying.shuffle_state ? "contained" : "outlined"}
                      color="primary"
                      onClick={handleOnShuffleClicked}
                    >
                      <Shuffle />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary" onClick={handlePrevious}>
                      <SkipPrevious />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handlePlayOrPause}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary" onClick={handleNext}>
                      <SkipNext />
                    </Button>
                  </Grid>
                </Grid>
              </div>
              <div className={classes.currentlyPlayingProgress}>
                <LinearProgress variant="determinate" value={getTrackProgress()} />
              </div>
            </Container>
          </div>
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
                    <div>{isSimpleList ? getSimplePlaylistItems() : getFancyPlaylistItems()}</div>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Container>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add song to playlist</DialogTitle>
            <DialogContent>
              <DialogContentText>Share -&gt; Copy link -&gt; Paste here -&gt; ?? -&gt; profit</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Spotify link"
                type="text"
                fullWidth
                onChange={onSongLinkChanged}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button color="primary" onClick={handleOnSongAdded}>
                Add song
              </Button>
            </DialogActions>
          </Dialog>
        </main>
      )
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Spotify sessions
          </Typography>
          {authAndPlaylistDone() && (
            <div>
              <Button color="inherit" onClick={handleClickOpen}>
                Add
              </Button>
              <FormGroup row>
                <FormControlLabel
                  control={<Switch checked={isSimpleList} onChange={handleFancyListChange} name="checkedA" />}
                  label="Simple list"
                />
              </FormGroup>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {getBody()}
    </div>
  )
}
