export const validateEmail = (email) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.toLowerCase());
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};
