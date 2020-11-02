/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core"
import React, { FunctionComponent } from "react"
import { AddSongDialogProps } from "../types"
import * as api from "../api"

export const AddSongDialogComponent: FunctionComponent<AddSongDialogProps> = ({
  showAddSongDialog,
  accessToken,
  playlistId,
  onDialogClose,
  onSongAdded,
}) => {
  const [addSong, setSongLink] = React.useState("")
  const onSongLinkChanged = (link: any) => setSongLink(link.target.value)
  const handleOnSongAdded = async () => {
    let uri = "spotify:track:" + addSong.substring(31, 53)
    await api.add(uri, accessToken, playlistId)
    onSongAdded()
  }

  const handleClose = () => onDialogClose(false)

  return (
    <React.Fragment>
      <Dialog open={showAddSongDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
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
    </React.Fragment>
  )
}

export default AddSongDialogComponent
