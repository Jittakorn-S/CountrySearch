#[macro_use]
extern crate rocket;

use rocket::serde::json::Json;
use serde::Serialize;
use calamine::{open_workbook, Reader, Xlsx};

#[derive(Serialize)]
struct Country {
    #[serde(rename = "Plan")]
    plan: String,
    #[serde(rename = "Region")]
    region: String,
    #[serde(rename = "Country")]
    country: String,
    #[serde(rename = "Currency")]
    currency: String,
    #[serde(rename = "CountryCode")]
    country_code: String,
    #[serde(rename = "PlanID")]
    plan_id: String,
    #[serde(rename = "Revamp")]
    revamp: String,
    #[serde(rename = "PhoneCode")]
    phone_code: String,
}

#[get("/api/read-excel")]
fn read_excel() -> Json<Vec<Country>> {
    let path = "public/CountryData.xlsx";
    let mut workbook: Xlsx<_> = open_workbook(path).expect("Cannot open file");

    let mut countries = Vec::new();

    if let Some(Ok(range)) = workbook.worksheet_range("Sheet1") {
        for row in range.rows().skip(1) { // Skip header row
            countries.push(Country {
                plan: row[0].to_string(),
                region: row[1].to_string(),
                country: row[2].to_string(),
                currency: row[3].to_string(),
                country_code: row[4].to_string(),
                plan_id: row[5].to_string(),
                revamp: row[6].to_string(),
                phone_code: row[7].to_string(),
            });
        }
    }

    Json(countries)
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![read_excel])
}