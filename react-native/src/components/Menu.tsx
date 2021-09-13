import React, {useRef} from 'react'
import {Image, StyleSheet, Pressable, Text} from 'react-native'
import Menu, {MenuItem} from 'react-native-material-menu'
import theme from '../styles/theme'

export type MenuOption = {
  text: string
  action: () => void
  warning?: boolean
}

type Props = {
  options: MenuOption[]
}

const ActionMenu: React.FunctionComponent<Props> = ({options}) => {
  const menuRef = useRef(null)

  const hideMenu = () => {
    if (!menuRef?.current) return
    menuRef?.current.hide()
  }

  const showMenu = () => {
    if (!menuRef?.current) return
    menuRef?.current.show()
  }

  return (
    <Menu
      ref={menuRef}
      button={
        <Pressable onPress={showMenu}>
          <Image source={require('../icons/more.png')} />
        </Pressable>
      }
      animationDuration={0}>
      {options.map((o, i) => (
        <MenuItem
          key={i}
          onPress={() => {
            o.action()
            hideMenu()
          }}>
          <Text
            style={[styles.text, o.warning && {color: theme.colors.redDark}]}>
            {o.text}
          </Text>
        </MenuItem>
      ))}
    </Menu>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: theme.fontSize.large,
    color: theme.colors.blueDark,
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexWrap: 'nowrap',
  },
})

export default ActionMenu
