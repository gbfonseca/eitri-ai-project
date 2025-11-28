import { formatDateDaysMonthYear } from '../../utils/utils'
import React from 'react'
import boxOrderIcon from '../../assets/icons/box-order-icon.svg'
import forDeliveryIcon from '../../assets/icons/for-delivery-icon.svg'
import deliveredIcon from '../../assets/icons/delivered-icon.svg'
import { CustomButton } from 'projeto-ai-shared'

export default function OrderDeliveryStatus({ order, setShowShippingData, showShippingData }) {
  const orderSteps = [
    {
      label: 'Enviado',
      status: '',
      icon: boxOrderIcon
    },
    {
      label: 'Saiu para entrega',
      status: '',
      icon: forDeliveryIcon
    },
    {
      label: 'Entregue',
      status: '',
      icon: deliveredIcon
    }
  ]

  return (
    <>
      <View
        padding='medium'
        borderBottomWidth='hairline'
        borderColor="primary-300"
      >
        <Text color='accent-100' fontSize='small' fontWeight='bold' marginBottom='medium'>
          {`Data prevista para a entrega: ${formatDateDaysMonthYear(order.shippingData.logisticsInfo[0].shippingEstimateDate)}`}
        </Text>

        <View
          marginBottom='medium'
          display='flex'
          direction='row'
          justifyContent='center'
          alignItems='center'
        >
          {orderSteps.map((step, index, array) => (
            <View display='flex' alignItems='top' justifyContent='center'>
              <Image
                src={step.icon}
                width={24}
                height={24}
                marginBottom='nano'
              />
              <View>
                {
                  index < array.length - 1 && (
                    <View
                      width={55}
                      height={2}
                      backgroundColor='accent-500'
                      marginTop='small'
                      marginHorizontal='small'
                    />
                  )
                }
              </View>
            </View>
          ))}
        </View>
        <View
          display='flex'
          direction='row'
          justifyContent='evenly'
          alignItems='center'
          width='100%'
          marginBottom='large'
        >
          {
            orderSteps.map((step, index, array) => (
              <Text
                color='neutral-900'
                fontSize='xs'
                marginHorizontal='medium'
              >
                {step.label}
              </Text>
            ))
          }
        </View>
      </View>

      <View
        padding='large'
        marginBottom='large'
        display='flex'
        direction='row'
        alignItems='center'
        gap={15}
        borderBottomWidth='hairline'
        borderColor='primary-300'
      >
        <View
          width={65}
          height={65}
        >
          <Image
            src={order.items[0].imageUrl}
            width={65}
            height={65}
          />
        </View>

        <View>
          <View
            marginBottom='small'
          >
            <Text
              fontSize='medium'
              fontWeight='bold'
            >
              Entrega Padrão
            </Text>
          </View>
          <View
            display='flex'
            direction='row'
            alignItems='center'
            gap={5}
          >
            Br209458235
            <Icon
              iconKey='copy'
              width={15}
              height={15}
            />
          </View>
        </View>
        <Touchable
          onPress={() => setShowShippingData(!showShippingData)}
          backgroundColor='transparent'
          borderColor='neutral-300'
          borderWidth='hairline'
          borderRadius='small'
          width='100px'
          height='28px'
          justifyContent='center'
          alignItems='center'
        >
          <Text
            fontSize='nano'
            fontWeight='bold'
          >
            Detalhes do pedido
          </Text>
        </Touchable>
      </View>
    </>
  )
}
