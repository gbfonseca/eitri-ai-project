import { formatAmountInCents } from '../../utils/utils'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { Text, View } from 'eitri-luminus'

export default function CartSummary() {
	const { t } = useTranslation()
	const { cart } = useLocalShoppingCart()

	// Calculate final total
	const finalTotal = cart?.totalizers?.reduce((acc, totalizer) => acc + totalizer.value, 0)

	return (
		<View className='bg-base-200 rounded p-4 w-full flex flex-col'>
			<View className='flex flex-row justify-start items-center mb-2 gap-2 flex-wrap'>
				{cart?.items?.map(item => (
					<View
						key={item.id}
						className='w-12 h-12 p-1 rounded-full overflow-hidden border'>
						<Image
							src={item.imageUrl}
							width='100%'
							height='100%'
							className='object-cover'
						/>
					</View>
				))}
			</View>

			{/* Totalizers breakdown */}
			<View className='flex flex-col gap-1 pb-2'>
				{cart?.totalizers?.map(totalizer => (
					<View
						key={totalizer.id}
						className='flex flex-row justify-between items-center'>
						<Text className='text-sm'>{totalizer.name}</Text>
						<Text className='font-medium'>{formatAmountInCents(totalizer.value)}</Text>
					</View>
				))}
			</View>

			{/* Final total */}
			<View className='flex flex-row w-full justify-between items-center pt-3 border-t border-neutral-300'>
				<Text className='font-bold'>{t('finishCart.txtTotal')}</Text>
				<Text className='text-primary-700'>{formatAmountInCents(finalTotal)}</Text>
			</View>
		</View>
	)
}
