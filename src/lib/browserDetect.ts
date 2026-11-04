/**
 * Browser detection utility to identify phone built-in browsers,
 * WebViews, and Web Share API file sharing capabilities.
 */

export interface BrowserInfo {
  name: string;
  isBuiltInBrowser: boolean;
  isInAppBrowser: boolean;
  canShareNative: boolean;
}

export function detectBrowser(): BrowserInfo {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      name: "Server",
      isBuiltInBrowser: false,
      isInAppBrowser: false,
      canShareNative: false,
    };
  }

  const ua = navigator.userAgent || "";

  // 1. Detect In-App Browsers / WebViews
  const isWhatsApp = /WhatsApp/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isFacebook = /FBAN|FBAV/i.test(ua);
  const isTikTok = /TikTok|musical_ly|ByteLocale/i.test(ua);
  const isLine = /Line\//i.test(ua);
  const isAndroidWebView =
    /;\s*wv\)/i.test(ua) ||
    (/Android/i.test(ua) &&
      /Version\/[0-9.]+/i.test(ua) &&
      !/SamsungBrowser/i.test(ua) &&
      !/Chrome\/[0-9.]+\s+Mobile/i.test(ua));

  const isInApp =
    isWhatsApp || isInstagram || isFacebook || isTikTok || isLine || isAndroidWebView;

  // 2. Detect Phone Built-in / Stock Browsers
  const isXiaomi = /MiuiBrowser|XiaoMi/i.test(ua);
  const isVivo = /VivoBrowser/i.test(ua);
  const isOppo = /HeyTapBrowser/i.test(ua);
  const isHuawei = /HuaweiBrowser|HBPC/i.test(ua);

  const isBuiltIn = isXiaomi || isVivo || isOppo || isHuawei || isInApp;

  // Browser Name derivation
  let name = "Browser Standar";
  if (isXiaomi) name = "Browser Bawaan Xiaomi (Mi Browser)";
  else if (isVivo) name = "Browser Bawaan Vivo";
  else if (isOppo) name = "Browser Bawaan Oppo / Realme";
  else if (isHuawei) name = "Browser Bawaan Huawei";
  else if (isWhatsApp) name = "WhatsApp In-App Browser";
  else if (isInstagram) name = "Instagram In-App Browser";
  else if (isFacebook) name = "Facebook In-App Browser";
  else if (isTikTok) name = "TikTok In-App Browser";
  else if (isAndroidWebView) name = "Android WebView";
  else if (/SamsungBrowser/i.test(ua)) name = "Samsung Internet";
  else if (/EdgA|Edge/i.test(ua)) name = "Microsoft Edge";
  else if (/Chrome|CriOS/i.test(ua)) name = "Google Chrome";
  else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) name = "Safari";
  else if (/Firefox|FxiOS/i.test(ua)) name = "Mozilla Firefox";

  // Check if browser genuinely supports native Web Share API with files.
  // Phone built-in browsers and WebViews are notorious for broken/unsupported file share intents.
  let canShareNative = false;
  if (!isBuiltIn) {
    try {
      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function"
      ) {
        const testFile = new File(["twibbon"], "test.png", { type: "image/png" });
        canShareNative = navigator.canShare({ files: [testFile] });
      }
    } catch {
      canShareNative = false;
    }
  }

  return {
    name,
    isBuiltInBrowser: isBuiltIn,
    isInAppBrowser: isInApp,
    canShareNative,
  };
}
