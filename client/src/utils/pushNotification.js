import { useContext } from 'react'
import addNotification from 'react-push-notification'
import { getUserById } from '../apiCalls'
import { AuthContext } from '../context/Auth'
import { Decrypt, DeriveKeys } from './crypto'

const PushNotification = () => {
  const { user } = useContext(AuthContext)
  const pushNotification = ({ senderId, text }) => {
    getUserById(senderId)
      .then((sender) => {
        DeriveKeys(sender.data?.publicKeyJwk, user?.privateKeyJwk)
          .then((res) => {
            Decrypt(text, res)
              .then((decryptMessage) => {
                addNotification({
                  title: `New message from ${sender.data?.username}`,
                  subtitle: `${sender.data?.username} says`,
                  message: decryptMessage,
                  native: false,
                  duration: 10000,
                  closeButton: 'Close',
                  silent: false,
                })
                addNotification({
                  title: `New message from ${sender.data?.username}`,
                  subtitle: `${sender.data?.username} says`,
                  message: decryptMessage,
                  native: true,
                  duration: 10000,
                  closeButton: 'Close',
                  silent: false,
                })
              })
              .catch((err) => console.log(err))
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  }

  return { pushNotification }
}

export default PushNotification
