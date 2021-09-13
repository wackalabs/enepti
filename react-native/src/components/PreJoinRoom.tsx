import React, {useCallback, useEffect, useState} from 'react'
import {KeyboardAvoidingView, Platform} from 'react-native'
import {View, StyleSheet, TextInput, Text, Pressable} from 'react-native'
import {useCallState} from '../contexts/CallProvider'
import { AccountType } from '../models'
import theme from '../styles/theme'

const PreJoinRoom = ({handleLinkPress}) => {
  const {joinRoom, error} = useCallState()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [roomName, setRoomName] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [required, setRequired] = useState(false)

  const submitForm = useCallback(
    (e) => {
      e.preventDefault()
      if (!firstName?.trim()) {
        setRequired(true)
        return
      }
      if (submitting) return
      setSubmitting(true)
      setRequired(false)

      let username =
        firstName?.trim() + (lastName?.trim() ? ` ${lastName?.trim()}` : '')

      let name = ''
      if (roomName?.trim()?.length) {
        name = username
        /**
         * We track the account type but appending it to the username.
         * This is a quick solution for now not a production-worthy solution!
         */
        username = `${username}_${AccountType.LISTENER}`
      } else {
        username = `${username}_${AccountType.MODERATOR}`
      }
      joinRoom({username, name})
    },
    [firstName, lastName, roomName, joinRoom],
  )

  useEffect(() => {
    if (error) {
      setSubmitting(false)
    }
  }, [error])

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        contentContainerStyle={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <Text style={styles.header}>Getting started</Text>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={[
            styles.input,
            required && {borderColor: theme.colors.red, borderWidth: 1},
          ]}
          onChangeText={(text) => setFirstName(text)}
        />
        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setLastName(text)}
        />
        <Text style={styles.label}>Join code</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setRoomName(text)}
        />
        <Text style={styles.smallText}>
          Enter code to join an existing room, or leave empty to create a new
          room.
        </Text>
        <Pressable
          onPress={submitForm}
          style={({pressed}) => [
            {
              backgroundColor: pressed
                ? theme.colors.cyan
                : theme.colors.turquoise,
            },
            styles.buttonContainer,
          ]}>
          <Text style={styles.submitButtonText}>
            {submitting
              ? 'Joining...'
              : roomName?.trim()
              ? 'Join room'
              : 'Create and join room'}
          </Text>
        </Pressable>
        {error && (
          <Text style={styles.errorText}>Error: {error.toString()}</Text>
        )}
      </KeyboardAvoidingView>
      <Pressable onPress={handleLinkPress}>
        <Text style={styles.link}>Learn more</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  content: {},
  header: {
    fontSize: theme.fontSize.xlarge,
    color: theme.colors.blueDark,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    color: theme.colors.blueDark,
    fontSize: theme.fontSize.large,
    marginBottom: 4,
    lineHeight: 16,
    marginTop: 16,
    fontWeight: '400',
  },
  input: {
    borderRadius: 8,
    borderColor: theme.colors.grey,
    borderWidth: 1,
    padding: 4,
    fontSize: theme.fontSize.xlarge,
    lineHeight: 24,
    marginBottom: 4,
    backgroundColor: theme.colors.white,
  },
  smallText: {
    fontSize: theme.fontSize.large,
    color: theme.colors.greyDark,
    fontWeight: '400',
    marginTop: 8,
    marginBottom: 24,
    marginHorizontal: 0,
  },
  buttonContainer: {
    overflow: 'hidden',
    marginBottom: 8,
    borderColor: theme.colors.cyanLight,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  submitButtonText: {
    fontSize: theme.fontSize.large,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.red,
    fontSize: theme.fontSize.large,
    marginBottom: 4,
  },
  link: {
    fontWeight: '400',
    fontSize: theme.fontSize.med,
    color: theme.colors.greyDark,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 16,
  },
})

export default PreJoinRoom
