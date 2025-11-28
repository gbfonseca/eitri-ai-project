import Eitri from 'eitri-bifrost'
import {TOKENS_DEFAULT} from "../../utils/constants";
import {getRemoteAppConfigProperty} from "../../utils/getRemoteConfigStyleProperty";

export default function HeaderFilter(props) {
	const { onPress, hasFilters, iconColor } = props

  const [_iconColor, setIconColor] = useState(iconColor || TOKENS_DEFAULT.HEADER_CONTENT_COLOR)

  useEffect(() => {
    loadColor()
  }, [])

  const loadColor = async () => {
    if (iconColor) return
    const headerContentColor = await getRemoteAppConfigProperty('headerContentColor')
    if (headerContentColor) {
      setIconColor(headerContentColor)
    }
  }

	return (
		<Touchable
			onPress={onPress}
			position='relative'>
			<View>
				<Icon
					color={_iconColor}
					iconKey='filter'
					width={24}
					height={24}
				/>
			</View>

			{hasFilters && (
				<View
					position='absolute'
					backgroundColor={_iconColor}
					width='12px'
					height='12px'
					right={-4}
					top={-2}
					borderRadius='circular'
				/>
			)}
		</Touchable>
	)
}
