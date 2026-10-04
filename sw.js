// 옥천군 재난상황 관리시스템 - 알림 표시 전용 최소 서비스워커
// (백그라운드 푸시 서버 없음. 탭이 열려있는 동안의 로컬 알림 표시만 담당)
self.addEventListener("install", function(e){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });

// 알림 클릭 시 앱 창으로 포커스 이동 + 해당 상황 열기
self.addEventListener("notificationclick", function(event){
  event.notification.close();
  var itemId = event.notification.data && event.notification.data.itemId;
  event.waitUntil(
    self.clients.matchAll({type: "window", includeUncontrolled: true}).then(function(clientList){
      for (var i = 0; i < clientList.length; i++){
        var client = clientList[i];
        if ("focus" in client){
          client.focus();
          if (itemId) client.postMessage({type: "open-item", id: itemId});
          return;
        }
      }
      // GitHub Pages 하위 경로(/okcheon-disaster-system/)로 열리도록 등록 범위 주소를 사용
      if (self.clients.openWindow) return self.clients.openWindow(self.registration.scope);
    })
  );
});
