class NotificationManager {
    constructor() {
      this.isSupported = "Notification" in window;
    }

    async requestPermission() {
      if (!this.isSupported) {
        throw new Error("Браузер не поддерживает уведомления");
      }

      if (Notification.permission === "granted") {
        return true;
      }

      if (Notification.permission === "denied") {
        return false;
      }

      try {
        const permission = await Notification.requestPermission();
        return permission === "granted";
      } catch (error) {
        console.error("Ошибка запроса разрешения:", error);
        return false;
      }
    }

    show(title, options = {}) {
      if (!this.isSupported) {
        console.warn("Браузер не поддерживает уведомления");
        return null;
      }

      if (Notification.permission !== "granted") {
        console.warn("Нет разрешения на показ уведомлений. Используйте requestPermission() по действию пользователя.");
        return null;
      }

      const defaultOptions = {
        body: "",
        icon: null,
        badge: null,
        tag: null,
        requireInteraction: false,
        silent: false
      };

      const notification = new Notification(title, { ...defaultOptions, ...options });

      // Автозакрытие через 5 секунд если не требует взаимодействия
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      return notification;
    }

    getPermissionStatus() {
      return Notification.permission;
    }

    isPermissionGranted() {
      return Notification.permission === "granted";
    }
} 

// Создаем глобальный экземпляр
const notifications = new NotificationManager();
window.notifications = notifications;

// Экспортируем для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}

// Глобальные функции
window.requestNotificationPermission = async function() {
    return await notifications.requestPermission();
};

window.showNotification = function(title, body, options = {}) {
    return notifications.show(title, { body, ...options });
};

window.showMessageNotification = function(message) {
    return notifications.show("Новое сообщение", {
      body: message,
      tag: "message",
      requireInteraction: true
    });
};

window.showInfoNotification = function(info) {
    return notifications.show("Информация", {
      body: info,
      tag: "info"
    });
};

// Простая функция для быстрого использования
window.enableNotifications = async function() {
    const granted = await notifications.requestPermission();
    if (granted) {
        console.log("Уведомления включены!");
        return true;
    } else {
        console.log("Разрешение отклонено");
        return false;
    }
};

// Пример использования с кнопкой
function setupNotificationButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', async () => {
            const granted = await requestNotificationPermission();
            if (granted) {
                showInfoNotification("Уведомления включены!");
            }
        });
    }
}