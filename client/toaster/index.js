class Toast {
  static show(title, body) {
    const bodyText = body.replace(/<[^>]*>/g, '');
    const notification = new Notification(title, {
      body: bodyText,
      icon: 'images/silly_chat_128.png'
    });

    notification.onclick = function () { window.focus(); };

    setTimeout(() => {
      notification.close();
    }, 4000);
  }
}

export default Toast;