import { View } from 'eitri-luminus'
import BottomInset from '../Shared/BottomInset/BottomInset'

export default function FixedBottom(props) {
	const { children, offSetHeight, className } = props

	return (
		<View>
			<View className='fixed bottom-0 left-0 w-full z-10 bg-base-200'>
				<View className={`p-4 ${className}`}>{children}</View>
				<BottomInset />
			</View>

			<View
				style={{ height: offSetHeight || 'auto' }}
				className='w-full'
			/>
		</View>
	)
}
