use futures::{ StreamExt, TryStreamExt };
use mongodb::bson::doc;
use mongodb::change_stream::event::OperationType;
use mongodb::options::{ FullDocumentBeforeChangeType, FullDocumentType };
use mongodb::{ Client, Collection, IndexModel };
use tokio::task;
use tracing::info;
use std::env;
use crate::types::{ User };

#[derive(Debug, Clone)]
pub struct Collections {
    pub users: Collection<User>,
}

pub async fn init_database() -> Result<Collections, String> {
    let uri: String = env::var("MONGODB").expect("MONGODB must be set");
    let client = Client::with_uri_str(uri).await.expect("Failed to connect to MongoDB");
    let user_db = client.database(
        env::var("USER_DATABASE").expect("USER_DATABASE must be set").as_str()
    );
    let users = user_db.collection(
        env::var("USER_COLLECTION").expect("USER_COLLECTION must be set").as_str()
    ) as Collection<User>;
    info!("Connected to MongoDB!");
    Ok(Collections { users })
}
