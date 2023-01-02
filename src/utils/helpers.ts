export const obscureEmail = (userEmail: string): string => {
  const email: string = userEmail.split('@')[0];
  const provider: string = userEmail.split('@')[1];

  let result: string = '';

  for (let i = 0; i < email.length; i++) {
    if (i === 0 || i === email.length - 1) {
      result += email[i];
    } else {
      result += '*';
    }
  }
  return result + '@' + provider;
};
