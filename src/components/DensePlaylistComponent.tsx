/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent } from "react"
import { PlaylistItem, FancyPlaylistProps } from "../types"
import * as api from "../api"
import { formatDuration, getTrackProgress } from "../utils"
import { Button, Grid, LinearProgress, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  cardBackgroundGreen: {
    backgroundColor: "#00c333",
  },
  cardBackgroundWhite: {},
  addedBy: {
    fontStyle: "italic",
    fontSize: 14,
  },
  bordered: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    border: "1px dashed",
    padding: 12,
  },
  labels: {
    wordBreak: "break-all",
  },
}))

export const DensePlaylistComponent: FunctionComponent<FancyPlaylistProps> = ({ playlist, currentlyPlaying }) => {
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
        <Grid item xs={2} key={index}>
          <div
            className={`${classes.bordered} ${
              currentlyPlayingTrackId === playlistItem.track.id
                ? classes.cardBackgroundGreen
                : classes.cardBackgroundWhite
            }`}
          >
            <Button
              size="small"
              color="secondary"
              variant="outlined"
              onClick={(_) => api.playSongAtOffsetPosition(index)}
            >
              Play
            </Button>

            <span className={classes.labels}>
              {playlistItem.track.album.artists[0].name} - {playlistItem.track.name} (
              {formatDuration(playlistItem.track.duration_ms)})
              <br />
              <span className={classes.addedBy}>{playlistItem.added_by.id}</span>
            </span>
          </div>
        </Grid>
      )
    })

    return (
      <Grid container spacing={2}>
        {output}
      </Grid>
    )
  }

  return <React.Fragment>{playlistItems()}</React.Fragment>
}

export default DensePlaylistComponent
