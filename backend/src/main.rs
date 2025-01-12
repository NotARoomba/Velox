use std::{ env, sync::Arc };
use axum::{ extract::Request, routing::get, Router, ServiceExt };
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{ Message, SmtpTransport, Transport };
use tokio::net::TcpListener;
use tracing::info;
use dotenv::dotenv;
use tracing_subscriber::FmtSubscriber;

mod utils;
mod routes;
mod types;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let _ = tracing::subscriber::set_global_default(FmtSubscriber::default());

    let collections = Arc::new(
        utils::init_database().await.expect("Failed to initialize database")
    );
    // let email = Message::builder()
    //     .from("Velox Verification <velox.verify@gmail.com>".parse().unwrap())
    //     .to("<kg5inb1@hotmail.com>".parse().unwrap())
    //     .subject("Verification Code")
    //     .header(ContentType::TEXT_PLAIN)
    //     .body(format!("Your verification code for Velox is: {}"))
    //     .unwrap();

    // let creds = Credentials::new(
    //     "velox.verify@gmail.com".to_owned(),
    //     env::var("GOOGLE_PASSWORD").unwrap().to_owned()
    // );

    // // Open a remote connection to gmail
    // let mailer = SmtpTransport::relay("smtp.gmail.com").unwrap().credentials(creds).build();

    // // Send the email
    // match mailer.send(&email) {
    //     Ok(_) => println!("Email sent successfully!"),
    //     Err(e) => panic!("Could not send email: {e:?}"),
    // }
    let app = Router::new()
        .route(
            "/",
            get(|| async { "You're not supposed to be here!" })
        )
        .nest("/users", routes::users::get_routes(Arc::clone(&collections)))
        .nest("/verify", routes::verify::get_routes());

    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    info!("Server running on port {}", port);

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port)).await.expect(
        "Failed to bind to port"
    );
    axum::serve(listener, app).await.expect("Server error");
}
