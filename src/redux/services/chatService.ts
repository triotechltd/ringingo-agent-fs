// PROJECT IMPORTS
import {
  ACCEPT_CHAT,
  ACTIVE_UNREAD_CHAT_LIST,
  CALL_WAITING_COUNT,
  CHANNEL_LIST,
  CHAT_HISTORY,
  END_CHAT,
  QUEUE_LIST,
  SEND_MESSAGE,
  TRANSFER_CHAT,
  UPDATE_CHANNEL,
  WHATS_APP_MESSAGE_LIST,
} from "@/API/constAPI";
import { apiInstance } from "../axiosApi";

/* ============================== CHAT SERVICES ============================== */

export const getCallWaitingCountGet = () => {
  return apiInstance.get(CALL_WAITING_COUNT);
};

export const activeUnreadChatListPost = (payload: any) => {
  return apiInstance.post(ACTIVE_UNREAD_CHAT_LIST, payload);
};

export const whatsAppMessagesListGet = (payload: any) => {
  return apiInstance.post(WHATS_APP_MESSAGE_LIST, payload);
};

export const acceptChatPost = (payload: any) => {
  return apiInstance.post(ACCEPT_CHAT, payload);
};

export const endChatPost = (payload: any) => {
  return apiInstance.post(END_CHAT, payload);
};

export const transferChatPut = (payload: any) => {
  return apiInstance.put(TRANSFER_CHAT, payload);
};

export const sendMessagePost = (payload: any) => {
  return apiInstance.post(SEND_MESSAGE, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const queueListGet = () => {
  return apiInstance.get(QUEUE_LIST);
};

export const channelListPost = (payload: any) => {
  return apiInstance.post(CHANNEL_LIST, payload);
};

export const updateMessagePut = (payload: any) => {
  return apiInstance.put(UPDATE_CHANNEL, payload);
};

export const chatHistoryPost = (payload: any) => {
  return apiInstance.post(CHAT_HISTORY, payload);
};