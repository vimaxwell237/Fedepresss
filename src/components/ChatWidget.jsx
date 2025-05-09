import React, { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    if (window.Tawk_API) return; // already loaded

    // Start of Tawk.to Script
    var Tawk_API = window.Tawk_API || {};
    var Tawk_LoadStart = new Date();

    (function(){
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/6817c9f751f397190f314291/1iqeepsa4';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1, s0);
    })();
    // End of Tawk.to Script
  }, []);

  return null;
};

export default ChatWidget;
