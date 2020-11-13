/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent } from "react"
import { PlaylistItem, FancyPlaylistProps } from "../types"
import * as api from "../api"
import { formatDuration, getTrackProgress } from "../utils"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },
  cardBackgroundGreen: {
    backgroundColor: "#00c333",
  },
  cardBackgroundWhite: {},
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}))

export const FancyPlaylistComponent: FunctionComponent<FancyPlaylistProps> = ({ playlist, currentlyPlaying }) => {
  const classes = useStyles()

  const playlistItems = () => {
    if (playlist === null) {
      return <div></div>
    } else if (playlist.items == null) {
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
                <LinearProgress
                  variant="determinate"
                  value={
                    currentlyPlaying == null
                      ? 0
                      : getTrackProgress(currentlyPlaying.progress_ms, currentlyPlaying.item.duration_ms)
                  }
                />
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="secondary" onClick={(_) => api.playSongAtOffsetPosition(index)}>
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

  return <React.Fragment>{playlistItems()}</React.Fragment>
}

export default FancyPlaylistComponent
