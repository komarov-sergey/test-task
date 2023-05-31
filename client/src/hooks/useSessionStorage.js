import {useEffect, useState} from 'react'

// eslint-disable-next-line
export default (key, initialValue = '') => {
  const [value, setValue] = useState(() => {
    return sessionStorage.getItem(key) || initialValue
  })

  useEffect(() => {
    sessionStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}
