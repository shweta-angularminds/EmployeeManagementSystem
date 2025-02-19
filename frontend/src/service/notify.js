import Swal from "sweetalert2";
import { Subject } from "rxjs";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000, // Toast stays for 3 seconds
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showToast = (message, type) => {
  Toast.fire({
    icon: type,
    title: message,
  });
};

export const confirmDelete = () => {
  const confirmSubject = new Subject();

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3674B5",
    cancelButtonColor: "#E52020",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      showToast("Deleted successfully!", "success");
      confirmSubject.next(true);
    } else {
      confirmSubject.next(false);
    }
    confirmSubject.complete();
  });

  return confirmSubject.asObservable();
};
