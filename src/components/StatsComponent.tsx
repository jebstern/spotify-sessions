import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core"
import React, { FunctionComponent } from "react"
import { StatsProps } from "../types"
import { formatDuration } from "../utils"

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}))

export const StatsComponent: FunctionComponent<StatsProps> = ({ showDialog, users, onDialogClose, playlist }) => {
  const classes = useStyles()
  const handleClose = () => onDialogClose(false)

  const getContributionsFromUser = (userId: string): string => {
    let totalDuration = 0
    if (!playlist.items) {
      return ""
    }
    const items = playlist.items.filter((item) => {
      if (item.added_by.id === userId) {
        totalDuration += item.track.duration_ms
        return true
      } else {
        return false
      }
    })
    return `${items.length} songs (${formatDuration(totalDuration)})`
  }

  const getUsers = () => {
    let items
    if (!users || users.length === 0) {
      items = <div></div>
    } else {
      items = users.map((user, index) => {
        if (user === null) {
          return <div key={index}></div>
        }
        return (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Box display="flex" alignItems="center">
              <Box p={1}>
                <Avatar
                  alt={user.display_name}
                  src={
                    user.images.length > 0
                      ? user.images[0].url
                      : "https://a.wattpad.com/useravatar/astleyislife.256.998877.jpg"
                  }
                  className={classes.large}
                />
              </Box>
              <Box p={1}>
                <Typography variant="subtitle1">
                  {user.display_name} ({user.id})
                </Typography>
                <Typography variant="subtitle2">{getContributionsFromUser(user.id)}</Typography>
              </Box>
            </Box>
            <br />
          </Grid>
        )
      })
    }

    return (
      <Grid container spacing={0}>
        {items}
      </Grid>
    )
  }

  return (
    <React.Fragment>
      <Dialog open={showDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Contributors</DialogTitle>
        <DialogContent>{getUsers()}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default StatsComponent
