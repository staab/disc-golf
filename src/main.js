import App from './App.svelte'

if (process.env.PRODUCTION) {
    window.dataLayer = window.dataLayer || []
    function gtag(){dataLayer.push(arguments)}
    gtag('js', new Date())
    gtag('config', 'UA-89355375-3')
}

export default new App({target: document.body})
