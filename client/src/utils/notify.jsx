// utils/notify.js
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const notify = (type, msg) => {
  const isMobile = window.innerWidth < 768; // 📱 mobile check

  if (isMobile) {
    Swal.fire({
      icon: type, // success | error | warning | info
      text: msg,
      timer: 2000,
      showConfirmButton: false,
      position: "center",
      customClass: {
        popup: "rounded-xl shadow-lg"
      }
    });
  } else {
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
    if (type === "info") toast.info(msg);
    if (type === "warning") toast.warn(msg);
  }
};
