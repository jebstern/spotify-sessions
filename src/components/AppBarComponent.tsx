import React, { FunctionComponent } from "react"
import { AppBar, Button, makeStyles, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core"
import { Menu as MenuIcon } from "@material-ui/icons"
import { AppBarProps } from "../types"

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  menuIcon: {
    color: "white",
  },
}))

export const AppBarComponent: FunctionComponent<AppBarProps> = ({
  authAndPlaylistDone,
  onShowSongDialog,
  onThemeChanged,
  onFancyListChange,
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleAddSongClick = () => {
    handleMenuClose()
    onShowSongDialog(true)
  }
  const handleThemeChange = () => {
    handleMenuClose()
    onThemeChanged()
  }
  const handleFancyListChange = () => {
    handleMenuClose()
    onFancyListChange()
  }

  return (
    <React.Fragment>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Spotify sessions
          </Typography>
          {authAndPlaylistDone && (
            <div>
              <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuOpen}>
                <MenuIcon className={classes.menuIcon} />
              </Button>
              <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleAddSongClick}>Add song</MenuItem>
                <MenuItem onClick={handleFancyListChange}>Toggle playlist mode</MenuItem>
                <MenuItem onClick={handleThemeChange}>Toggle dark mode</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default AppBarComponent
