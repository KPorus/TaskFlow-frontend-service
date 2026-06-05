export const SESSION_EXPIRED_EVENT = "taskflow:session-expired";

export const emitSessionExpired = () => {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
};
