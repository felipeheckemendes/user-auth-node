exports.resetPasswordEmail = (to, token) => {
  return {
    to: to,
    subject: `Password reset - ${process.env.APP_NAME} (valid for ${process.env.PASSWORD_RESET_VALID})`,
    text: `Forgot your password? Please send the a PATCH request on url ${process.env.APP_URL}${process.env.API_URI}/resetPassword. This request if valid for ${process.env.PASSWORD_RESET_VALID}. he body should contain: newPassword, newPasswordConfirm and the token: ${token}`,
    html: `<h1>Password Reset</h1><p>Forgot your password? Please send the a PATCH request on url: </p> <p>${process.env.APP_URL}${process.env.API_URI}/resetPassword.</p> <p>This request if valid for ${process.env.PASSWORD_RESET_VALID}.</p> <p>The request body should contain: <ul><li>newPassword</li> <li>newPasswordConfirm</li> <li>token:"${token}"</li></ul></p>`,
  };
};
