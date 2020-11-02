/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent } from "react"
import { CurrentlyPlayingProps } from "../types"
import { formatDuration } from "../utils"

export const CurrentlyPlayingComponent: FunctionComponent<CurrentlyPlayingProps> = ({ currentlyPlaying }) => {
  const output = () => {
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

  return <React.Fragment>{output()}</React.Fragment>
}

export default CurrentlyPlayingComponent
