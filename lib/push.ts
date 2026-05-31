import "server-only";

import webpush from "web-push";

type WebPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export function getVapidPublicKey() {
  return getRequiredEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY");
}

export function configureWebPush() {
  webpush.setVapidDetails(
    getRequiredEnv("WEB_PUSH_SUBJECT"),
    getRequiredEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY"),
    getRequiredEnv("WEB_PUSH_PRIVATE_KEY"),
  );
}

export async function sendWebPush(
  subscription: WebPushSubscription,
  payload: {
    title: string;
    body: string;
    url?: string;
    tag?: string;
  },
) {
  configureWebPush();

  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
