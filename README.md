# Eitri Shopping Black Skull

Documentação simples para desenvolvimento com Eitri.

## Login no Eitri

Para autenticar como desenvolvedor, execute o comando no terminal:

```bash
eitri login
```

Siga as instruções que aparecem para completar a autenticação com sua conta de desenvolvedor.

## Rodando um Eitri-App

Navegue até a pasta do eitri-app e inicie o desenvolvimento:

```bash
eitri start
```

A CLI irá gerar um QR code que você deve escanear usando o app da sua organização onde o Eitri está integrado.

## Rodando Múltiplos Eitri-Apps

### Pré-requisitos

- CLI versão 1.17.0 ou superior
- Shared Eitri-App previamente publicado com `sharedVersion: "v2"` no `eitri-app.conf.js`

### Passos para Implementação

#### 1. Adicionar Dependências

Adicione os Shared Eitri-Apps no `eitri-app.conf.js` do seu Eitri-App principal:

```javascript
'eitri-app-dependencies': {
    'eitri-vtex': {
        version: '0.1.350',
        isEitriAppShared: true
    },
    'ds-components': {
        version: '1.4.18',
        isEitriAppShared: true
    }
}
```

#### 2. Importar Componentes

Nas telas desejadas, importe dos Shared Eitri-Apps:

```javascript
import { EitriVtex } from "eitri-vtex";
import { Button, FavoriteButton, ProductImage } from "ds-components";
```

#### 3. Configurar app-config.yaml para Desenvolvimento

Ao usar `app-start` com múltiplos Shared apps, configure seu `app-config.yaml`:

- Defina `alias` correspondente ao nome da dependência (slug do Shared)
- Adicione o campo `shared: true` para identificar Shared Eitri-Apps
- A CLI automaticamente cria links para as versões de desenvolvimento

A CLI e o compilador irão automaticamente interpretar quais Shared Eitri-Apps estão sendo usados, criando links para suas versões de desenvolvimento.

## Documentações de Referência

### Luminus UI

- **Versão 2 (Latest):** https://cdn.83io.com.br/library/luminus-ui/doc/latest/
- **Versão 1 (1.84.0):** https://cdn.83io.com.br/library/luminus-ui/doc/1.84.0/

### Outras Bibliotecas

- **Eitri Agents:** https://cdn.83io.com.br/library/eitri-agents/doc/latest/
- **Bifrost:** https://cdn.83io.com.br/library/eitri-bifrost/doc/4.3.0/index.html

## Documentação Completa

Para mais informações, consulte a documentação oficial do Eitri:

- **Guia Rápido:** https://docs.eitri.tech/pt/guia-rapido/
- **Tutoriais:** https://docs.eitri.tech/pt/tutoriais/

## Eitri Shopping Vtex Shared

```js
import {
  Vtex,
  App,
  EventBus,
  EventBusChannels,
  Tracking,
} from "eitri-shopping-vtex-shared";
```

## `Vtex`

- **configs**: objeto de configuração preenchido por `configure`. Campos: `account`, `api`, `host`, `domain`, `vtexCmsUrl`, `sendGACampaignAlongSession`, `searchOptions`, `segments`, `session`, `marketingTag`, `salesChannel`, `faststore`.
- **configure(remoteConfig)**: inicializa `configs` a partir de `remoteConfig` (usa `providerInfo.account/host/domain/vtexCmsUrl/faststore`, `storePreferences.segments/marketingTag/salesChannel`, `appConfigs.sendGACampaignAlongSession`, `searchOptions`). Dispara `buildSession` e, salvo `remoteConfig.skipRefreshToken`, roda `customer.executeRefreshToken()`. Retorno: `Promise<void>`.
- **buildSession(segments, update)**: cria/atualiza sessão VTEX com segmentos públicos (`segments` objeto chave→valor). Usa `POST api/sessions` ou `PATCH api/sessions` conforme `update` (`boolean`). Retorno: `Promise<object|null>` com o payload de sessão ou `null` em erro/ausência de segmentos.
- **tryAutoConfigure(overwrites)**: encaminha para `App.tryAutoConfigure(overwrites)`. Retorno: `Promise<object>` com as configs aplicadas do app.
- **updateSegmentSession(utmParams)**: mescla `utmParams` com `configs.segments`, chama `buildSession(..., true)` e atualiza `configs.session`/`configs.segments`. Retorno: `Promise<object|null>` (resultado de `buildSession`).
- **refreshSegmentSession()**: busca `utmParams` via `customer.getUtmParams()` e chama `updateSegmentSession`. Retorno: `Promise<void>`.
- **Serviços anexados** (usados via `Vtex.<servico>`):
  - `catalog`: operações de catálogo (busca/listagem de produtos).
  - `checkout`: etapas de checkout.
  - `customer`: dados do cliente, sessão e `getUtmParams()`.
  - `cart`: carrinho (adicionar/atualizar/remover itens).
  - `cms`: conteúdos CMS VTEX.
  - `wishlist`: lista de desejos.
  - `store`: dados da loja (ex.: geolocalização, loja atual).
  - `searchGraphql`: buscas via GraphQL.
  - `http`: caller HTTP genérico VTEX.
  - `googlePay`: integrações Google Pay.

## `App`

- **configs**: objeto base `{ verbose, gaVerbose }`, sobrescrito por configs remotas.
- **tryAutoConfigure(overwrites)**: assina o canal `Vtex.customer.CHANNEL_UTM_PARAMS_KEY` no `EventBus`, obtém `remoteConfig` via `Eitri.environment.getRemoteConfigs()`, aplica `overwrites`, chama `Vtex.configure(remoteConfig)` e, se configurado, inicializa o Clarity e ajusta a cor do status bar. Retorno: `Promise<object>` com `App.configs` final (inclui `storePreferences.currencyCode` default `BRL` caso ausente).

## `EventBusChannels`

- Constantes de canais: `ADD_TO_WISHLIST`, `REMOVE_FROM_WISHLIST`, `ADD_TO_CART`, `UPDATE_CART_ITEM` (strings). Úteis para padronizar assinatura/publicação.

## `Tracking`

- **ga**: proxy para `GAService` (`src/services/tracking/GAService`). Usar para eventos de Google Analytics.

## `EventBus`

- **BROADCAST_ALLOWED**: cache interno de elegibilidade de broadcast (`boolean|null`).
- **isBroadcastAllowed()**: verifica se o dispositivo suporta broadcast (bloqueia iOS com `osVersion` < `15.4`). Retorno: `Promise<boolean>`.
- **subscribe(payload)**: inscreve no `Eitri.eventBus`. `payload` aceita `{ channel, callback, broadcast?: boolean, ... }`; se `broadcast` não permitido, remove o flag antes de delegar. Retorno: `Promise<any>` (handle de inscrição do `eventBus`).
- **publish(payload)**: publica no `Eitri.eventBus`. `payload` aceita `{ channel, data, broadcast?: boolean, ... }`; se broadcast não permitido, publica sem esse flag. Retorno: `Promise<any>` (resultado de `eventBus.publish`).
