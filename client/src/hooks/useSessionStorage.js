import {useEffect, useState} from 'react'

export default (key, initialValue = '') => {
  const [value, setValue] = useState(() => {
    return sessionStorage.getItem(key) || initialValue
  })

  useEffect(() => {
    sessionStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}
