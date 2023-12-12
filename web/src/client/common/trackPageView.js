export default function trackPageView(state) {
  if (typeof window.ga !== 'undefined') {
    window.ga('send', 'pageview', {
      'page': state.path
    });
  }
}
