use axum::{routing::get, Json, Router};
use calamine::{open_workbook, Reader, Xlsx};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::services::ServeDir;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "PascalCase")]
struct Country {
    plan: String,
    region: String,
    country: String,
    currency: String,
    country_code: String,
    plan_id: String,
    revamp: String,
    phone_code: String,
}

async fn get_country_data() -> Json<Vec<Country>> {
    let mut excel: Xlsx<_> =
        open_workbook("CountryData.xlsx").expect("Cannot open Excel file");
    let mut countries = Vec::new();

    if let Some(Ok(range)) = excel.worksheet_range("Sheet1") {
        for row in range.rows().skip(1) {
            // Skip header row
            let country = Country {
                plan: row[0].to_string(),
                region: row[1].to_string(),
                country: row[2].to_string(),
                currency: row[3].to_string(),
                country_code: row[4].to_string(),
                plan_id: row[5].to_string(),
                revamp: row[6].to_string(),
                phone_code: row[7].to_string(),
            };
            countries.push(country);
        }
    }

    Json(countries)
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/read-excel", get(get_country_data))
        .nest_service("/", ServeDir::new("static"));

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}