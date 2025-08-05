import CountrySearch from "@/components/country-search";
import { ModeToggle } from "@/components/ui/toggle";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Country Data Search</h1>
        <ModeToggle />
      </div>
      <CountrySearch />
    </main>
  )
}