import React from 'react'

export default function OrderTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return null
  }

  return (
    <View
      direction='column'
      alignItems='center'
      paddingHorizontal='large'
      paddingVertical='large'
      borderBottomWidth='hairline'
      borderColor="primary-300"
      marginBottom='medium'
    >
      {events.map((event, index) => {
        if (!event) return null

        const isActive = Boolean(event.completed)

        return (
          <View
            key={`timeline-${index}`}
            direction='row'
            alignItems='flex-start'
          >
            <View
              width={40}
            >
              <Text
                color={isActive ? 'secondary-500' : 'neutral-700'}
                fontSize='small'
                fontWeight='bold'
              >
                {event.date}
              </Text>
            </View>

            <View
              display='flex'
              direction='column'
              alignItems='center'
              width={20}
              marginHorizontal='small'
            >
              <View
                width={16}
                height={16}
                borderRadius='medium'
                backgroundColor={isActive ? 'secondary-500' : 'neutral-700'}
              />
              {index < events.length - 1 && (
                <View width={2} height={56} backgroundColor='neutral-700' />
              )}
            </View>

            <View direction='column' gap='4px' grow={1} width={200}>
              <Text
                color={isActive ? 'secondary-500' : 'neutral-700'}
                fontSize='small'
              >
                {event.description}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}
