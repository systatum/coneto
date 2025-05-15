export function phoneTrim(input: string) {
    const onlyNumber = input.replace(/[^0-9]/g, "");
    let phoneNumber = onlyNumber;
  
    if (phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.slice(1);
    }
    return phoneNumber;
  }
  
  export function formatPhoneDisplay(phone: string) {
    const digits = phone.replace(/\D/g, "");
    const match = digits.match(/^(\d{0,3})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return digits;
  
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join("-");
  }
  