// 邮箱正则表达式
export const validateEmail = (email) => {
  var regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (regex.test(email)) {
    return true;
  } else {
    return false;
  }
};

// 国内手机号的正则表达式
export const validatePhoneNumber = (phoneNumber) => {
  var pattern = /^1[3456789]\d{9}$/;
  return pattern.test(phoneNumber);
};

// 密码长度为8-20个字符，包含数字、大小写字母 正则表达式
export const validatePassword = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/;
  return regex.test(password);
};

// 3-20个字符，仅限英文，数字和下划线正则表达式
export const validateInput = (input) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(input);
};

// 5~20字符，仅限小写字母和数字，必须小写字母开头 正则表达式
export const validateName = (input) => {
  const regex = /^[a-z][a-z0-9]{4,19}$/;
  return regex.test(input);
};

// 请确保，输入长度为6~63位名称；只能包含中英文、数字。必须小写字母开头 正则表达式
export const validateKeyname = (input) => {
  const regex = /^[A-Za-z0-9\u4e00-\u9fa5]{6,63}$/;
  return regex.test(input);
};
//身份证验证
export const validateIdCard = (input) => {
  const regex =
    /^(^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$)|(^[1-9]\d{7}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$)$/;
  return regex.test(input);
};
