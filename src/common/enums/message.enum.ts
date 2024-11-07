export enum PublicMessage {
    Deleted = 'Entity deleted successfully!',
    SentOtp = "OTP code sent Successfully!",
    LoggedIn = "Logged in successfully!",
    Created = "Created Sucessfully!",
    AlreadyExist = "Already exists!",
    Updated = "",
  }
  
export enum NotFoundMessage {
  NotFoundUser = 'User NOT FOUND!',
  NotFoundOrder = 'Order not found',
  NotFoundBook = 'Book not found',
  NotFoundLibrary = "Library Not Found!"
}

export enum AuthMessage {
  AlreadyExistAccount = "A user with the same credentials already exists!",
  TryAgain = "Try again!",
  LoginAgain = "Login to your account again",
  LoginIsRequired="You should first login to your account!",
  CodeExpired="Your OTP code is expired! Try again!",
}

export enum BadRequestMessage {
  InvalidOTP = "Your OTP code is invalid!",
}