use serde::{ Deserialize, Serialize };

pub struct User {
    pub username: String,
    pub email: String,
    pub date_created: i64,
    //TODO GAMES
}

#[derive(Debug, Deserialize, Clone, Copy)]
pub enum StatusCodes {
    Success = 0,
    GenericError,
    UserNotFound,
    InvalidNumber,
    SentCode,
    NumberNotExist,
    ErrorSendingCode,
    TooManyAttempts,
    CodeDenied,
    CodeExpired,
    CodeFailed,
    AlreadyReported,
    MismatchedImage,
    NoConnection,
    InvalidData,
}
impl Serialize for StatusCodes {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: serde::Serializer {
        serializer.serialize_u8(*self as u8)
    }
}
