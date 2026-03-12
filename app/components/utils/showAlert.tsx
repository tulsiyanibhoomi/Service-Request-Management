import Swal from "sweetalert2";

export const showPositiveAlert = async (message: string) => {
  return Swal.fire({
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const showErrorAlert = async (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
};
