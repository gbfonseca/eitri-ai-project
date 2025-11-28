import React from 'react'
import creditCard from '../../assets/icons/credit-card.svg'
import bankInvoice from '../../assets/icons/bank-invoice-icon.svg'
import { formatAmountInCents } from '../../utils/utils'
import formatDate, { formatDateDaysMonthYear } from '../../utils/Date'
import masterCardIcon from '../../assets/icons/master-card-icon.svg'
import Eitri from 'eitri-bifrost'
import OrderStatusBadge from '../OrderList/OrderStatusBadge'

export default function PaymentDetails({ order, orderSumary, products }) {

  const handlePaymentMethod = (paymentMethod) => {
    if (paymentMethod === 'creditCard') {
      return (
        <View
          width='100%'
          direction='column'
          gap='16px'
          marginBottom='small'
        >
          <View direction='column' gap='8px'>
            <View
              direction='row'
              alignItems='center'
              justifyContent='between'
              marginBottom='small'
            >
              <Text
                fontSize='medium'
                color='accent-100'
                fontWeight='bold'
              >
                Cartão de crédito
              </Text>
              <Image
                src={masterCardIcon}
              />
            </View>
            <Text
              fontSize='small'
              color='accent-100'
              marginBottom='medium'
            >
              O pagamento via cartão de crédito foi aprovado e já foi processado com sucesso. Sua compra está confirmada e será concluída em ambiente seguro.
            </Text>

            <Text
              fontSize='small'
              color='secondary-500'
              fontWeight='bold'
            >
              {`Valor total pago: ${formatAmountInCents(
                orderSumary
                  .map(item => item.value)
                  .reduce((acc, curr) => acc + curr, 0)
              )} em ${order.paymentData.transactions[0].payments[0].installments}x sem juros`}
            </Text>
          </View>
        </View>
      )
    }
    if (paymentMethod === 'bankInvoice') {
      return (
        <View
          width='100%'
          direction='column'
          gap='16px'
          marginBottom='small'
        >
          <View direction='column' gap='8px'>
            <View
              direction='row'
              alignItems='center'
              justifyContent='between'
              marginBottom='small'
            >
              <Text
                fontSize='medium'
                color='accent-100'
                fontWeight='bold'
              >
                Boleto Bancário
              </Text>
              <Image
                src={bankInvoice}
              />
            </View>
            <Text
              fontSize='small'
              color='accent-100'
              marginBottom='medium'
            >
              O pagamento via boleto bancário. Acesse o link abaixo para realizar o pagamento.
            </Text>

            <Touchable onPress={() => Eitri.openBrowser({ url: order.paymentData.transactions[0].payments[0].url })}>
              <Text
                fontSize='small'
                color='secondary-500'
                fontWeight='bold'
                textDecoration='underline'
              >
                Ver boleto
              </Text>
            </Touchable>
            <Text
              fontSize='small'
              color='secondary-500'
              fontWeight='bold'
            >
              {`Valor total: ${formatAmountInCents(
                orderSumary
                  .map(item => item.value)
                  .reduce((acc, curr) => acc + curr, 0)
              )}`}
            </Text>
          </View>
        </View>
      )
    }
  }

  const totalProductsValue = orderSumary.map(item => item.value).reduce((acc, curr) => acc + curr, 0)

  const handleShippingEstimate = (shippingEstimate) => {
    return shippingEstimate.replace(/[a-zA-Z]/g, '')
  }

  return (
    <View>
      <View marginBottom='small'>
        <View
          display='flex'
          alignItems='center'
          gap='small'
        >
          <Image
            src={creditCard}
          />
          <Text
            marginHorizontal='small'
            fontSize='medium'
            fontWeight='bold'
          >
            PAGAMENTO
          </Text>
        </View>
      </View>

      <View
        borderBottomWidth='hairline'
        borderColor="primary-300"
        marginBottom='small'
      >
        <View
          display='flex'
          direction='row'
          alignItems='center'
          justifyContent='between'
          backgroundColor='primary-100'
          borderRadius='small'
          paddingVertical='medium'
          gap={3}
        >
          <View
            width='104px'
          >
            <Image
              src={order.items[0].imageUrl}
              width={'100%'}
              height={'100%'}
            />
          </View>


          <View
            direction='column'
            gap='5px'
            paddingHorizontal='nano'
            width='230px'
          >
            <View
              display='flex'
              direction='row'
              gap={5}
            >
              <Text
                fontSize='medium'
                color='accent-100'
                fontWeight='bold'
              >
                Status do pedido:
              </Text>
              <OrderStatusBadge
                statusId={order.status}
                statusDescription={order.statusDescription}
              />
            </View>

            <View>
              <Text
                fontSize='medium'
                color='accent-100'
                fontWeight='bold'
              >
                {`Nº do pedido: ${order.orderId.split('-')[0]}`}
              </Text>
            </View>

            <View
              display='flex'
              direction='row'
              alignItems='center'
              gap={20}
            >
              <View
                direction='column'
                gap='5px'
              >
                <View
                  gap='5px'
                >
                  <Text
                    color='accent-100'
                    block
                    fontSize='small'
                    fontWeight='light'
                  >
                    {`Realizado em: ${formatDateDaysMonthYear(order.creationDate, 'dd/mm/yyyy hh:mm')}`}
                  </Text>
                </View>

                {order?.shippingData?.logisticsInfo[0]?.shippingEstimateDate && (
                  <View
                    width='100%'
                    direction='column'
                    gap='5px'
                  >
                    <View display='flex'>
                      <Text
                        color='accent-100'
                        block
                        fontSize='small'
                        fontWeight='light'
                      >
                        {`Entrega até ${formatDateDaysMonthYear(order?.shippingData?.logisticsInfo[0]?.shippingEstimateDate, 'dd/mm/yyyy')}`}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View
              borderBottomWidth='hairline'
              borderColor='primary-300'
            >
              <View
                direction='flex'
                gap='5px'
                marginBottom='nano'
              >
                <Text
                  fontSize='small'
                  color='accent-100'
                  fontWeight='bold'
                >
                  Valor:
                </Text>
                <Text
                  fontSize='small'
                  color='secondary-500'
                  fontWeight='bold'
                >
                  {` ${formatAmountInCents(totalProductsValue)}`}
                </Text>
              </View>

              <View direction='flex' gap='5px' marginBottom='nano'>
                <Text
                  fontSize='small'
                  color='accent-100'
                  fontWeight='bold'
                >
                  Frete:
                </Text>
                <Text
                  fontSize='small'
                  color='secondary-500'
                  fontWeight='bold'
                >
                  {` ${formatAmountInCents(order?.shippingData?.logisticsInfo[0]?.price)}`}
                </Text>
              </View>
            </View>

            <View direction='flex' gap='5px'>
              <Text
                fontSize='medium'
                color='accent-100'
                fontWeight='bold'
              >
                Total:
              </Text>
              <Text
                fontSize='medium'
                color='secondary-500'
                fontWeight='bold'
              >
                {` ${formatAmountInCents(totalProductsValue + order?.shippingData?.logisticsInfo[0]?.price)}`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        paddingVertical='medium'
        borderBottomWidth='hairline'
        borderColor="primary-300"
        marginBottom='small'
      >
        {handlePaymentMethod(order.paymentData.transactions[0].payments[0].group)}
      </View>

      <View paddingVertical='medium'>
        {products.length > 0 && (
          <OrderProductCard
            orderId={order.orderId}
            productItems={products}
            key={order.orderId}
            delivery={
              order.ShippingEstimatedDateMax &&
              formatDate(order.ShippingEstimatedDateMax)
            }
          />
        )}
      </View>

      <View>
        <View
          display='flex'
          alignItems='center'
          gap={10}
          marginBottom='medium'
        >
          <Icon iconKey='truck' width={24} height={24} color='accent-100' />
          <Text
            fontSize='medium'
            color='accent-100'
            fontWeight='bold'
          >
            ENTREGA
          </Text>
        </View>

        <View
          display='flex'
          direction='row'
          justifyContent='between'
          alignItems='center'
          gap='10px'
          marginBottom='small'
        >
          <View
            direction='column'
            gap='5px'
            width='150px'
          >
            <Text
              fontSize='medium'
              color='accent-100'
              fontWeight='bold'
            >
              Entrega Rápida
            </Text>
            <Text
              fontSize='small'
            >
              {`em até ${handleShippingEstimate(order?.shippingData?.logisticsInfo[0]?.shippingEstimate)} dias úteis`}
            </Text>
          </View>
          <View
            width='200px'
          >
            <Text
              fontSize='medium'
              color='accent-100'
              fontWeight='bold'
            >
              Destinatário:
            </Text>
            <Text
              fontSize='small'
            >
              {order?.shippingData?.address?.receiverName}
            </Text>
          </View>
        </View>

        <View direction='column' gap='5px'>
          <Text fontSize='medium' color='accent-100' fontWeight='bold'>Endereço:</Text>
          <Text>
            {`${order?.shippingData?.address?.street}, ${order?.shippingData?.address?.number} ${order?.shippingData?.address?.complement} - ${order?.shippingData?.address?.neighborhood}`}
          </Text>
          <Text>
            {order?.shippingData?.address?.city} - {order?.shippingData?.address?.state}
          </Text>
          <Text>
            {`CEP: ${order?.shippingData?.address?.postalCode}`}
          </Text>
        </View>

      </View>

    </View>
  )
}
