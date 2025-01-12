use std::env;

use axum::{ extract::Query, response::IntoResponse, routing::get, Json, Router };
use serde::Deserialize;
use serde_json::json;

use crate::types::StatusCodes;

#[derive(Debug, Deserialize)]
pub struct GetParams {
    number: Option<String>,
}

pub async fn send(Query(params): Query<GetParams>) -> impl IntoResponse {
    //TODO

    // if let Ok(response) = res {
    //     if let Ok(verification) = response.json::<SendResponse>().await {
    //         if verification.status == "pending" {
    //             return Json(json!({"status": StatusCodes::Success}));
    //         } else if !verification.lookup.valid {
    //             return Json(json!({"status": StatusCodes::NumberNotExist}));
    //         }
    //     }
    // } else if let Err(e) = res {
    //     let status = e.status().unwrap().as_u16();
    //     if status == 429 {
    //         return Json(json!({"status": StatusCodes::TooManyAttempts}));
    //     } else if status == 60200 {
    //         return Json(json!({"status": StatusCodes::NumberNotExist}));
    //     }
    // }
    Json(json!({"status": StatusCodes::ErrorSendingCode}))
}

pub async fn check(Json(body): Json<GetParams>) -> impl IntoResponse {
    //TODO

    // if let Ok(response) = res {
    //     if let Ok(verification) = response.json::<SendResponse>().await {
    //         if verification.status == "approved" {
    //             return Json(json!({"status": StatusCodes::Success}));
    //         } else {
    //             return Json(json!({"status": StatusCodes::CodeDenied}));
    //         }
    //     }
    // } else if let Err(e) = res {
    //     let status = e.status().unwrap().as_u16();
    //     if status == 400 && status == 60200 {
    //         return Json(json!({"status": StatusCodes::CodeDenied}));
    //     } else if status == 404 && status == 20404 {
    //         return Json(json!({"status": StatusCodes::CodeExpired}));
    //     }
    // }
    Json(json!({"status": StatusCodes::CodeFailed}))
}

pub fn get_routes() -> Router {
    Router::new()
        .route(
            "/send",
            get({
                move |params| async move { send(params).await }
            })
        )
        .route(
            "/check",
            get({
                move |body| async move { check(body).await }
            })
        )
}
