use yew::prelude::*;
use reqwasm::http::Request;
use serde::Deserialize;

#[derive(Clone, PartialEq, Deserialize)]
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

#[function_component(App)]
pub fn app() -> Html {
    let countries = use_state(|| vec![]);
    let filtered_countries = use_state(|| vec![]);
    let search_term = use_state(|| "".to_string());

    {
        let countries = countries.clone();
        use_effect_with_deps(move |_| {
            wasm_bindgen_futures::spawn_local(async move {
                let fetched_countries: Vec<Country> = Request::get("/api/read-excel")
                    .send()
                    .await
                    .unwrap()
                    .json()
                    .await
                    .unwrap();
                countries.set(fetched_countries);
            });
            || ()
        }, ());
    }

    let on_search = {
        let search_term = search_term.clone();
        let countries = countries.clone();
        let filtered_countries = filtered_countries.clone();
        Callback::from(move |_| {
            let term = &*search_term;
            let filtered = countries
                .iter()
                .filter(|country| country.country.to_lowercase().contains(&term.to_lowercase()))
                .cloned()
                .collect::<Vec<Country>>();
            filtered_countries.set(filtered);
        })
    };
    html! {
        <div>
            <h1>{ "Country Search" }</h1>
            <input
                type="text"
                placeholder="Search for a country"
                oninput={Callback::from(move |e: InputEvent| {
                    let value = e.target_unchecked_into::<web_sys::HtmlInputElement>().value();
                    search_term.set(value);
                })}
            />
            <button onclick={on_search}>{ "Search" }</button>

            <table>
                <thead>
                    <tr>
                        <th>{ "Country" }</th>
                        <th>{ "Region" }</th>
                        <th>{ "Plan" }</th>
                    </tr>
                </thead>
                <tbody>
                    { for filtered_countries.iter().map(|country| html! {
                        <tr>
                            <td>{ &country.country }</td>
                            <td>{ &country.region }</td>
                            <td>{ &country.plan }</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }
}