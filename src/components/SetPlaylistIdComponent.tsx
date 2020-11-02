import { Button, Container, Grid, makeStyles, TextField, TextFieldProps, Typography } from "@material-ui/core"
import React, { FunctionComponent, useRef } from "react"

const useStyles = makeStyles((theme) => ({
  addPlaylistContainer: {
    display: "flex",
    "& > :nth-child(2)": {
      marginLeft: 22,
    },
  },
  heroContent: {
    padding: theme.spacing(5, 1),
  },
}))

export const SetPlaylistIdComponent: FunctionComponent<any> = ({ onPlaylistSet }) => {
  const classes = useStyles()
  const playlistIdRef = useRef<TextFieldProps>(null)
  const handleOnPlaylistIdSet = () => onPlaylistSet(playlistIdRef?.current?.value as string)

  return (
    <React.Fragment>
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
              <Grid item xs={12} sm={5} md={6} className={classes.addPlaylistContainer} onClick={handleOnPlaylistIdSet}>
                <Button variant="contained" color="primary" size="small">
                  Set
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>
      </main>
    </React.Fragment>
  )
}

export default SetPlaylistIdComponent
