import React, { useState } from 'react'

export default function ToggleButton(props) {
  const { onPress, active: externalActive } = props

  const [active, setActive] = useState(externalActive)

  const handleToggle = () => {
    setActive(!active)

    if (onPress) {
      onPress()
    }
  }

  return (
    <Touchable
      display='display'
      justifyContent='between'
      onPress={handleToggle}
    >
      <View
        borderBottomStyle='solid'
        backgroundColor='secondary-500'
        borderRadius='medium'
        width={36}
        padding='quark'
        display='flex'
        justifyContent={active ? 'end' : 'strat'}>
        <View
          display='block'
          backgroundColor={active ? 'accent-100' : 'primary-500'}
          width={16}
          height={16}
          borderRadius='pill'></View>
      </View>
    </Touchable>
  )
}
