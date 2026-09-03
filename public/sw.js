self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // 간단한 PWA 설치 요건을 맞추기 위한 빈 패치 핸들러입니다.
  // 실제 오프라인 캐싱은 구현하지 않습니다.
});
