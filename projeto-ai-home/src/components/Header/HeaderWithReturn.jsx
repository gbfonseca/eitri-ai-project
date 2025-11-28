import { HeaderReturn, HeaderContentWrapper, HeaderText } from 'projeto-ai-shared'

export default function HeaderWithReturn(props) {
  const { text } = props

  return (
    <HeaderContentWrapper>
      <View
        display='flex'
        justifyContent='between'
        alignItems='center'
        width='100%'>
        <HeaderReturn />
        <HeaderText text={text} />
      </View>

    </HeaderContentWrapper>
  )
}
