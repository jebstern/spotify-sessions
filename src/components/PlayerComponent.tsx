import { Button, Container, Grid, LinearProgress, Typography, makeStyles } from "@material-ui/core"
import { Shuffle, SkipPrevious, Pause, PlayArrow, SkipNext } from "@material-ui/icons"
import React, { FunctionComponent } from "react"
import { PlayerProps } from "../types"
import { getTrackProgress } from "../utils"
import CurrentlyPlayingComponent from "./CurrentlyPlayingComponent"
import * as api from "../api"

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  heroContent: {
    padding: theme.spacing(5, 1),
  },
  heroButtons: {
    marginTop: theme.spacing(2),
  },
  currentlyPlayingProgress: {
    margin: "16px auto",
    width: 302,
  },
}))

export const PlayerComponent: FunctionComponent<PlayerProps> = ({ currentlyPlaying, isPlaying, accessToken }) => {
  const classes = useStyles()

  const handleOnShuffleClicked = () => api.shuffle(!currentlyPlaying.shuffle_state, accessToken)
  const handlePrevious = () => api.previous(accessToken)
  const handleNext = () => api.next(accessToken)
  const handlePlayOrPause = () => (isPlaying ? api.pause(accessToken) : api.play(accessToken))

  return (
    <React.Fragment>
      <div className={classes.heroContent}>
        <Container maxWidth="md">
          <Typography variant="h6" className={classes.title}>
            <CurrentlyPlayingComponent currentlyPlaying={currentlyPlaying} />
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
            <LinearProgress
              variant="determinate"
              value={
                currentlyPlaying === null || currentlyPlaying.item === undefined
                  ? 0
                  : getTrackProgress(currentlyPlaying.progress_ms, currentlyPlaying.item.duration_ms)
              }
            />
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PlayerComponent
