// Toast utility functions using react-toastify
import { toast } from 'react-toastify';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      rtl: true,
      className: 'toast-rtl'
    });
  },
  
  error: (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      rtl: true,
      className: 'toast-rtl'
    });
  },
  
  warning: (message) => {
    toast.warning(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      rtl: true,
      className: 'toast-rtl'
    });
  },
  
  info: (message) => {
    toast.info(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      rtl: true,
      className: 'toast-rtl'
    });
  }
};
