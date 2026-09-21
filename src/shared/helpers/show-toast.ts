import { toast } from 'sonner';
type ShowToastArgs = {
  status: 'success' | 'error';
  text:   string;
};
export const showToast = ({ status, text }: ShowToastArgs) => {
  toast[status](text);
};
