import Eitri from 'eitri-bifrost'
import { Page, View, Text } from 'eitri-luminus'
import HeaderContentWrapper from '../components/Shared/Header/HeaderContentWrapper'
import CustomButton from '../components/Shared/CustomButton/CustomButton'
import { openAccount } from '../services/navigationService'
import { trackScreenView } from '../services/Tracking'
import { useEffect } from 'react'

export default function ExternalProviderOrderFinished(props) {
	const PAGE = 'External Provider Order Finished'

	useEffect(() => {
		trackScreenView(PAGE, 'ExternalProviderOrderFinished')
	}, [])

	return (
		<Page>
			<HeaderContentWrapper />
			<View className='p-4 flex flex-col items-center mt-6'>
				<View className='w-24 h-24 rounded-full flex items-center justify-center mb-8'>
					<View className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center'>
						<Text className='text-white text-3xl font-bold'>✓</Text>
					</View>
				</View>

				<View className='bg-base-200 rounded p-4'>
					<View className='mb-6 flex flex-col items-center'>
						<Text className='text-2xl w-full font-bold text-center mb-2'>
							Solicitação enviada!
						</Text>
						<Text className='text-base text-center leading-relaxed'>
							Acompanhe seu pedido em "Meus pedidos". Se houve algum problema no pagamento, é só clicar em
							"Tentar novamente"!
						</Text>
					</View>

					{/* Action Buttons */}
					<View className='flex flex-col gap-4'>
						<CustomButton
							label={'Ver meus pedidos'}
							onPress={openAccount}
							block
						/>
						<CustomButton
							outlined
							label={'Tentar novamente'}
							onPress={() => Eitri.navigation.back()}
						/>
					</View>
				</View>
			</View>
		</Page>
	)
}
