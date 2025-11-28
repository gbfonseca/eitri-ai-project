import Eitri from 'eitri-bifrost'
import { App } from 'eitri-shopping-vtex-shared'

export const startConfigure = async () => {
	// const { applicationData } = await Eitri.getConfigs()
	// const eitriSource = applicationData?.platform === 'ios' ? 'eitri-shop-ios' : 'eitri-shop-android'

	await App.tryAutoConfigure({
		verbose: false,
		gaVerbose: false
		// storePreferences: {
		// 	marketingTag: eitriSource
		// }
	})
}
