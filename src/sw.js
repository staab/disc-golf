import {registerRoute} from 'workbox-routing'
import {BackgroundSyncPlugin} from 'workbox-background-sync'
import {NetworkOnly, NetworkFirst} from 'workbox-strategies'

registerRoute(
  ({request}) => ['script', 'style'].includes(request.destination),
  new NetworkFirst({
    cacheName: 'scriptsAndStyles',
  })
)

const matchBackendless = ({url, request}) =>
  url.origin.includes('api.backendless.com')

registerRoute(
  matchBackendless,
  new NetworkFirst({
    cacheName: 'backendlessData',
  })
)

const backendlessEffectHandler = new NetworkOnly({
  cacheName: 'backendlessEffects',
  plugins: [
    new BackgroundSyncPlugin('backendless-queue', {maxRetentionTime: 24 * 60}),
  ],
})

const jsonResponse = data =>
  new Response(JSON.stringify(data), {
    headers: {'Content-Type': 'application/json'}
  })

const handleBackendlessEffect = async req => {
  try {
    return await backendlessEffectHandler.handle(req)
  } catch (e) {
    if (e.toString().includes('no-response')) {
      return jsonResponse({error: 'offline'})
    } else {
      throw e
    }
  }
}

registerRoute(matchBackendless, handleBackendlessEffect, 'POST')
registerRoute(matchBackendless, handleBackendlessEffect, 'PUT')
