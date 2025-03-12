"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import CountryResults from "./country-results";
import toast from "react-hot-toast";
import { Country } from "@/lib/country-data";

export default function CountrySearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [regionFilter, setRegionFilter] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [currencyFilter, setCurrencyFilter] = useState("");
    const [revampFilter, setRevampFilter] = useState("");
    const [results, setResults] = useState<Country[]>([]);
    const [countryData, setCountryData] = useState<Country[]>([]);

    useEffect(() => {
        fetch("/api/read-excel")
            .then((res) => res.json())
            .then((data) => {
                setCountryData(data.data);
            })
            .catch((err) => toast.error(err));
    }, []);

    const handleSearch = () => {
        if (countryData.length > 0) {
            const filtered = countryData.filter((country) => {
                const matchesSearch = searchTerm === "" || country.Country.toLowerCase().includes(searchTerm.toLowerCase()) || country.CountryCode.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRegion = regionFilter === "" || regionFilter === "all" || country.Region === regionFilter;
                const matchesPlan = planFilter === "" || planFilter === "all" || country.Plan === planFilter;
                const matchesCurrency = currencyFilter === "" || currencyFilter === "all" || country.Currency === currencyFilter;
                const matchesRevamp = revampFilter === "" || revampFilter === "all" || country.Revamp === revampFilter;
                return matchesSearch && matchesRegion && matchesPlan && matchesCurrency && matchesRevamp;
            });

            setResults(filtered);
            if (filtered.length === 0) {
                toast.error("No results found. Please try again.");
            }
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        setRegionFilter("");
        setPlanFilter("");
        setCurrencyFilter("");
        setRevampFilter("");
        setResults([]);
    };

    const regions = countryData.length > 0 ? Array.from(new Set(countryData.map((country) => country.Region))) : [];
    const plans = countryData.length > 0 ? Array.from(new Set(countryData.map((country) => country.Plan))) : [];
    const currency = countryData.length > 0 ? Array.from(new Set(countryData.map((country) => country.Currency))) : [];
    const revamp = countryData.length > 0 ? Array.from(new Set(countryData.map((country) => country.Revamp))) : [];

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="search">Search by Country Name or Code</Label>
                            <Input
                                id="search"
                                placeholder="e.g. Thailand, TH"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="region">Filter by Region</Label>
                                <Select value={regionFilter} onValueChange={setRegionFilter}>
                                    <SelectTrigger id="region">
                                        <SelectValue placeholder="All Regions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Regions</SelectItem>
                                        {regions.map((region) => (
                                            <SelectItem key={region} value={region}>
                                                {region}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="plan">Filter by Plan</Label>
                                <Select value={planFilter} onValueChange={setPlanFilter}>
                                    <SelectTrigger id="plan">
                                        <SelectValue placeholder="All Plans" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Plans</SelectItem>
                                        {plans.map((plan) => (
                                            <SelectItem key={plan} value={plan}>
                                                {plan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="currency">Filter by Currency</Label>
                                <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="All Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Currency</SelectItem>
                                        {currency.map((currency) => (
                                            <SelectItem key={currency} value={currency}>
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="revamp">Filter by Revamp</Label>
                                <Select value={revampFilter} onValueChange={setRevampFilter}>
                                    <SelectTrigger id="revamp">
                                        <SelectValue placeholder="All Revamp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Revamp</SelectItem>
                                        {revamp.map((revamp) => (
                                            <SelectItem key={revamp} value={revamp}>
                                                {revamp}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSearch}>Search</Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <CountryResults results={results} />
        </div>
    );
}