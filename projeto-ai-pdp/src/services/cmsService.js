import { App, Vtex } from 'eitri-shopping-vtex-shared'
import Eitri from 'eitri-bifrost'
import { getFbRemoteConfig } from './RemoteConfigService'

export const getCmsContent = async (contentType, pageName) => {
	const { faststore, eitriCmsUrl, eitriDummyCmsUrl } = App.configs.providerInfo

	let loader = null
	let cacheKey = ''

	if (eitriCmsUrl) {
		cacheKey = `eitri_cms`
		loader = loadPayloadCmsPage.bind(null, eitriCmsUrl, contentType, pageName)
	}
	else if (eitriDummyCmsUrl) {
		cacheKey = eitriDummyCmsUrl
		loader = loadEitriDummyCmsPage.bind(null, eitriDummyCmsUrl, contentType, pageName)
	}
	else if (faststore) {
		cacheKey = faststore
		loader = loadVtexCmsPage.bind(null, faststore, contentType, pageName)
	}
	if (!loader) return null

	// const cachedPage = await loadPageFromCache(cacheKey, contentType, pageName)
	//
	// if (cachedPage) {
	// 	loader()
	// 		.then(page => {
	// 			if (page) {
	// 				savePageInCache(cacheKey, contentType, pageName, page)
	// 			}
	// 		})
	// 		.catch(e => {})
	//
	// 	return cachedPage
	// }

	const page = await loader()
	if (page) {
		savePageInCache(cacheKey, contentType, pageName, page)
		return page
	}

	return null
}

export const loadVtexCmsPage = async (faststore, contentType, pageName) => {
	const result = await Vtex.cms.getPagesByContentTypes(faststore, contentType)
	const page = result.data.find(item => item.name?.toLowerCase() === pageName?.toLowerCase())
	return filterRemoteConfigContent(page)
}

export const loadEitriDummyCmsPage = async (eitriDummyCmsUrl, contentType, pageName) => {
	const response = await Eitri.http.get(
		`${eitriDummyCmsUrl}/${pageName}.json`
	)

	const { data } = response.data

	return data[0];
}

export const loadPayloadCmsPage = async (payloadCmsUrl, contentType, pageName) => {
	const response = await Eitri.http.get(
		`${payloadCmsUrl}/api/vtex-cms-pages?locale=pt-br&draft=false&depth=1&vtexFormat=true`
	)

	return response?.data?.docs?.reduce((acc, doc) => {
		if (acc) return acc
		const _page = doc?.data?.find(
			doc =>
				doc?.type?.toLowerCase() === contentType?.toLowerCase() &&
				doc.name?.toLowerCase() === pageName?.toLowerCase()
		)
		if (_page) {
			acc = _page
		}
		return acc
	}, null)
}

export const loadPageFromCache = async (faststore, contentType, pageName) => {
	try {
		const cacheKey = `${faststore}_${contentType}_${pageName}`
		const content = await Eitri.sharedStorage.getItemJson(cacheKey)
		if (!content) return

		const inputDate = new Date(content.cachedIn)
		const currentDate = new Date()
		const differenceInMs = currentDate - inputDate
		const twentyFourHoursInMs = 86400000
		if (differenceInMs > twentyFourHoursInMs) {
			console.log('Cache expirado, buscando novo...')
			return null
		}
		return content
	} catch (error) {
		console.error('Error trying load from cache', error)
		return null
	}
}

export const savePageInCache = async (faststore, contentType, pageName, page) => {
	try {
		const cacheKey = `${faststore}_${contentType}_${pageName}`
		console.log('Salvando no cache...', cacheKey)
		Eitri.sharedStorage.setItemJson(cacheKey, { cachedIn: new Date().toISOString(), ...page })
	} catch (error) {
		console.error('Error trying save in cache', error)
	}
}

export const filterRemoteConfigContent = async cmsPageContent => {
	if (!cmsPageContent) return null

	try {
		const remoteConfigKeys = extractRemoteConfigKeys(cmsPageContent)
		console.log('Remote remoteConfigKeys:', remoteConfigKeys)
		const remoteConfigMap = await fetchRemoteConfigs(remoteConfigKeys)
		console.log('Remote config map:', remoteConfigMap)
		return {
			...cmsPageContent,
			sections: filterSectionsByRemoteConfig(cmsPageContent.sections, remoteConfigMap)
		}
	} catch (error) {
		console.error('Error filtering remote config content:', error)
		return cmsPageContent
	}
}

const extractRemoteConfigKeys = cmsPageContent => {
	const keys = new Set()

	cmsPageContent.sections.forEach(section => {
		if (section.data?.remoteConfigKey) {
			keys.add(section.data.remoteConfigKey)
		}

		if (section.name === 'MultipleImageBanner') {
			section.data.images?.forEach(image => {
				if (image?.remoteConfigKey) {
					keys.add(image.remoteConfigKey)
				}
			})
		}
	})

	return Array.from(keys)
}

const fetchRemoteConfigs = async keys => {
	try {
		const results = await Promise.all(keys.map(getFbRemoteConfig))
		return results.reduce((acc, result, index) => {
			acc[keys[index]] = result ?? false
			return acc
		}, {})
	} catch (error) {
		console.error('Error fetching remote configs:', error)
		return {}
	}
}

const filterSectionsByRemoteConfig = (sections, remoteConfigMap) => {
	return sections.filter(section => {
		if (section.data?.remoteConfigKey && !remoteConfigMap[section.data.remoteConfigKey]) {
			return false
		}

		if (section.name === 'MultipleImageBanner') {
			section.data.images = section.data.images?.filter(
				image => !(image?.remoteConfigKey && !remoteConfigMap[image.remoteConfigKey])
			)
		}

		return true
	})
}
