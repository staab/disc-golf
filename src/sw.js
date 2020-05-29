import {registerRoute} from 'workbox-routing'
import {BackgroundSyncPlugin} from 'workbox-background-sync'
import {NetworkOnly, NetworkFirst, StaleWhileRevalidate} from 'workbox-strategies'

const jsonResponse = data =>
  new Response(JSON.stringify(data), {
    headers: {'Content-Type': 'application/json'}
  })

registerRoute(
  ({request}) => request.destination === 'script',
  new NetworkFirst({
    cacheName: 'scripts',
  })
)

registerRoute(
  ({request}) => request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'styles',
  })
)

const matchBackendless = ({url, request}) =>
  url.origin.includes('api.backendless.com')

const backendlessHandler = new NetworkOnly({
  cacheName: 'backendless',
  plugins: [
    new BackgroundSyncPlugin('backendless-queue', {maxRetentionTime: 24 * 60}),
  ],
})

const handleBackendless = async req => {
  try {
    return await backendlessHandler.handle(req)
  } catch (e) {
    if (e.toString().includes('no-response')) {
      return jsonResponse({error: 'offline'})
    } else {
      throw e
    }
  }
}

registerRoute(matchBackendless, handleBackendless, 'POST')
registerRoute(matchBackendless, handleBackendless, 'PUT')
