import React, { FunctionComponent } from "react"
import { AppBar, Badge, Button, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from "@material-ui/core"
import { Menu as MenuIcon, Person } from "@material-ui/icons"
import { AppBarProps } from "../types"

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  menuIcon: {
    color: "white",
  },
  toolbar: {
    padding: 0,
  },
}))

export const AppBarComponent: FunctionComponent<AppBarProps> = ({
  authAndPlaylistDone,
  onShowSongDialog,
  onThemeChanged,
  onFancyListChange,
  onContributorsChange,
  listeners,
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

  const handleContributorsChange = () => {
    handleMenuClose()
    onContributorsChange()
  }

  return (
    <React.Fragment>
      <AppBar position="relative">
        <Toolbar className={classes.toolbar}>
          <IconButton aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={listeners} color="secondary">
              <Person />
            </Badge>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Grani lillajul 2020
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
                <MenuItem onClick={handleContributorsChange}>Show contributors</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default AppBarComponent
