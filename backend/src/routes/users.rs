use std::sync::Arc;

use axum::extract::Path;
use axum::routing::{ get, post };
use axum::{ Json, Router };
use axum::{ extract, response::IntoResponse };
use mongodb::bson::doc;
use serde_json::json;

use crate::types::{ StatusCodes, User };
use crate::utils::Collections;

pub async fn get_user(
    Path(user_email): Path<String>,
    collections: &Collections
) -> impl IntoResponse {
    // println!("Getting user with number: {:?}", params.number);
    if user_email.len() == 0 {
        return Json(json!({"status": StatusCodes::InvalidNumber}));
    }
    let user = collections.users
        .find_one(doc! { "email": user_email.clone() }).await
        .unwrap_or(None);
    match user {
        Some(user) => Json(json!({"status": StatusCodes::Success, "user": user})),
        None => {
            let user = collections.users
                .find_one(doc! { "username": user_email }).await
                .unwrap_or(None);
            match user {
                Some(user) => Json(json!({"status": StatusCodes::Success, "user": user})),
                None => Json(json!({"status": StatusCodes::UserNotFound})),
            }
        }
    }
}

pub async fn update_user(
    extract::Json(u): extract::Json<User>,
    collections: &Collections
) -> impl IntoResponse {
    // only thing that should be updated is username
    //     if u.location.coordinates.len() != 2 {
    //         return Json(json!({"status": StatusCodes::InvalidData}));
    //     } else if u.number.len() == 0 {
    //         return Json(json!({"status": StatusCodes::InvalidNumber}));
    //     }
    //     let user = u.clone();
    //    //TODO
    //     match update_result {
    //         Ok(_) => Json(json!({"status": StatusCodes::Success})),
    //         Err(e) => {
    //             println!("Error updating user: {:?}", e);
    //             return Json(json!({"status": StatusCodes::GenericError}));
    //         }
    //     }
}

pub fn get_routes(collections: Arc<Collections>) -> Router {
    Router::new()
        .route(
            "/",
            post({
                let collections = Arc::clone(&collections);
                move |body| async move { update_user(body, &*collections).await }
            })
        )
        .route(
            "/:user_email",
            get({
                let collections = Arc::clone(&collections);
                move |params| async move { get_user(params, &*collections).await }
            })
        )
}
