import { toast } from 'sonner';
type ShowToastArgs = {
  status: 'success' | 'error';
  text:   string;
};
export const showToast = ({ status, text }: ShowToastArgs) => {
  toast[status](text);
};

const PENDING_TOAST_KEY = 'pending-toast';

// Тост, который надо показать уже после полной перезагрузки страницы
// (выход, удаление аккаунта) — иначе он исчезнет вместе со страницей
export const showToastAfterReload = (args: ShowToastArgs) => {
  try {
    sessionStorage.setItem(PENDING_TOAST_KEY, JSON.stringify(args));
  } catch {}
};

export const flushPendingToast = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_TOAST_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PENDING_TOAST_KEY);
    showToast(JSON.parse(raw) as ShowToastArgs);
  } catch {}
};
