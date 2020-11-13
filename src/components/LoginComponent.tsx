import { Button, Container, Grid, makeStyles, Typography } from "@material-ui/core"
import React, { FunctionComponent } from "react"
import * as dotenv from 'dotenv'
dotenv.config()

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(5, 1),
  },
}))

export const LoginComponent: FunctionComponent<any> = () => {
  const classes = useStyles()

  const handleLogIn = () => {
    const redirect_uri =
      process.env.NODE_ENV === "production"
        ? "https://spotify-session-fe.herokuapp.com"
        : process.env.REACT_APP_REDIRECT_URL
    const scope =
      "user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private"
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=code&state=spotify-session-state-key-09876-54321`
  }

  return (
    <React.Fragment>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography variant="h3">You need to log in first!</Typography>
                <Typography variant="body1">This app won't work unless you log in to Spotify.</Typography>
                <br />
                <Button variant="contained" color="primary" onClick={handleLogIn}>
                  Log in
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>
      </main>
    </React.Fragment>
  )
}

export default LoginComponent
