export default function formatDate(isoDate) {
	if (!isoDate) return ''

	const date = new Date(isoDate)

	const day = String(date.getUTCDate()).padStart(2, '0')
	const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Janeiro é 0!
	const year = date.getUTCFullYear()

	return `${day}/${month}/${year}`
}

const months = {
	'janeiro': '01',
	'fevereiro': '02',
	'março': '03',
	'abril': '04',
	'maio': '05',
	'junho': '06',
	'julho': '07',
	'agosto': '08',
	'setembro': '09',
	'outubro': '10',
	'novembro': '11',
	'dezembro': '12',
}

export const formatDateDaysMonthYear = (date, format = 'dd/mm/yyyy') => {
	if (!date) return ''
	
	const data = new Date(date)
	
	const brazilTime = new Date(data.getTime() - (3 * 60 * 60 * 1000))
	
	const dia = brazilTime.getDate() < 10 ? `0${brazilTime.getDate()}` : brazilTime.getDate()
	const mes = brazilTime.toLocaleString('pt-BR', { month: 'long' })
	const ano = brazilTime.getFullYear()
	const horas = String(brazilTime.getHours()).padStart(2, '0')
	const minutos = String(brazilTime.getMinutes()).padStart(2, '0')
	
	if (format === 'dd/mm/yyyy') {
		return `${dia}/${months[mes]}/${ano}`
	}

	if (format === 'dd/mm/yyyy hh:mm') {
		return `${dia}/${months[mes]}/${ano} às ${horas}:${minutos}`
	}

	return `${dia} de ${mes} de ${ano} às ${horas}:${minutos}`
}
