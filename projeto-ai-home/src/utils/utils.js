import { App } from 'eitri-shopping-vtex-shared'

export const formatPrice = (price, _locale, _currency) => {
	if (!price) return ''

	const locale = _locale || App.configs?.storePreferences?.locale || 'pt-BR'
	const currency = _currency || App.configs?.storePreferences?.currencyCode || 'BRL'

	return price.toLocaleString(locale, { style: 'currency', currency: currency })
}

export const renderVideo = (video, poster) => {
	return (
		<video
			autoPlay
			loop
			muted
			playsInline
			poster={poster}
			style={{ objectFit: 'cover', width: '100%', height: '100%' }}>
			<source
				src={video}
				type='video/mp4'
			/>
		</video>
	)
}

export const slugify = str => {
	if (typeof str !== 'string' || !str.trim()) {
		return '';            // retorna vazio por padrão
	}
	
	return str
		.normalize('NFD')                // decompõe "ã" em "a" + "~"
		.replace(/[\u0300-\u036f]/g, '') // remove o "~"
		.replace(/[^A-Za-z0-9]+/g, '_')  // tudo que não for letra/número vira "_"
		.replace(/_+/g, '_')             // colapsa múltiplos "_" em um só
		.replace(/^_|_$/g, '')			// remove "_" nas extremidades
		.toLowerCase();          		// passa para minúsculo
}