import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { Link, useLoader, useNavigation } from 'vxs'

// export async function loader() {
//   return {
//     hello: 'world',
//   }
// }

export default function HomePage() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ title: 'Home' })
  }, [])

  // const data = useLoader(loader)

  useEffect(() => {
    fetch('/hello')
      .then((res) => res.json())
      .then((x) => console.log('got', x))
  }, [])

  return (
    <>
      <View>
        <Text>Hi from home</Text>
      </View>

      {/* <View>
        <Text>data: {JSON.stringify(data, null, 2)}</Text>
      </View> */}

      <Link
        href={{
          pathname: '/[user]',
          params: { user: 'other' },
        }}
      >
        <Text>Go to "other" user</Text>
      </Link>
    </>
  )
}
