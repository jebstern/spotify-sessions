/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent } from "react"
import { PlaylistItem, FancyPlaylistProps } from "../types"
import * as api from "../api"
import { formatDuration, getTrackProgress } from "../utils"
import { Button, LinearProgress, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  cardBackgroundGreen: {
    backgroundColor: "#00c333",
  },
  cardBackgroundWhite: {},
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
}))

export const SimplePlaylistComponent: FunctionComponent<FancyPlaylistProps> = ({
  playlist,
  currentlyPlaying,
}) => {
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
        <div
          key={index}
          className={`${classes.listRoot} ${
            currentlyPlayingTrackId === playlistItem.track.id
              ? classes.cardBackgroundGreen
              : classes.cardBackgroundWhite
          }`}
        >
          <img src={playlistItem.track.album.images[0].url} alt="asd" width="60" />

          <Button size="medium" color="secondary" onClick={(_) => api.playSongAtOffsetPosition(index)}>
            Play
          </Button>

          <span>
            {playlistItem.track.album.artists[0].name} - {playlistItem.track.name} (
            {formatDuration(playlistItem.track.duration_ms)})
            <br />
            <span className={classes.addedBy}>{playlistItem.added_by.id}</span>
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
          </span>
        </div>
      )
    })

    return <div>{output}</div>
  }

  return <React.Fragment>{playlistItems()}</React.Fragment>
}

export default SimplePlaylistComponent
