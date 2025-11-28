import { Tracking } from 'eitri-shopping-vtex-shared'

export const logScreenView = async (friendlyPageName, pageClass) => {
	try {
		Tracking.ga.logScreenView(friendlyPageName, pageClass)
	  } catch (e) {}
}

export const logEvent = async (event, data) => {
	try {
		Tracking.ga.logEvent(event, data)
	} catch (e) {}
}

export const logError = async (event, error) => {
	try {
		Tracking.ga.logError(event, error)
	} catch (e) {}
}

export const logAudienceCategory = async (pageOrigin, audienceCategories) => {
	try {
		if (audienceCategories?.length > 0) {
			for (const category of audienceCategories) {
				const _category = category?.trim()?.toLowerCase()
				if (_category) {
					logEvent(pageOrigin, 'view_category', { item_name: _category })
				}
			}
		}
	} catch (e) {
		console.error('Erro ao registrar categoria de audiência', e)
	}
}