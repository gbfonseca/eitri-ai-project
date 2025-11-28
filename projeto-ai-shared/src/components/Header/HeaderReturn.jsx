import Eitri from 'eitri-bifrost'
import { getRemoteAppConfigProperty } from '../../utils/getRemoteConfigStyleProperty'
import { TOKENS_DEFAULT } from '../../utils/constants'

export default function HeaderReturn(props) {
	const { backPage, iconColor, onPress, width } = props

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

	const onBack = () => {
		if (typeof onPress === 'function') {
			return onPress()
		} else {
			if (backPage) {
				Eitri.navigation.back(backPage)
			} else {
				Eitri.navigation.back()
			}
		}
	}

	return (
		<Touchable
			onPress={onBack}
			display='flex'
			alignItems='center'
			justifyContent='center'
			width={width}>
			<Icon
				iconKey='chevron-left'
				color={_iconColor}
				width={24}
				height={24}
			/>
		</Touchable>
	)
}
