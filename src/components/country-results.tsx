import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Country } from "@/lib/country-data"
import { v4 as uuidv4 } from "uuid";

interface CountryResultsProps {
    results: Country[]
}

export default function CountryResults({ results }: CountryResultsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Search Results ({results.length})</CardTitle>
            </CardHeader>
            <CardContent>
                {results.length > 0 ? (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Country Name</TableHead>
                                    <TableHead>Country Code</TableHead>
                                    <TableHead>Plan Id</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Currency</TableHead>
                                    <TableHead>Revamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((country) => (
                                    <TableRow key={uuidv4()}>
                                        <TableCell className="font-medium">{country.Country}</TableCell>
                                        <TableCell>{country.CountryCode}</TableCell>
                                        <TableCell>{country.PlanID}</TableCell>
                                        <TableCell>{country.Region}</TableCell>
                                        <TableCell>{country.Currency}</TableCell>
                                        <TableCell>{country.Revamp}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        Use the search form above to find countries. Click the Search button to see results.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}