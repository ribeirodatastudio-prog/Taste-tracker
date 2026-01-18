import VisitForm from "@/components/visit-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center md:text-left space-y-2">
           <h1 className="text-4xl font-extrabold tracking-tight text-primary">Taste Tracker</h1>
           <p className="text-muted-foreground text-lg">Journal your dining experiences.</p>
        </header>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
           <VisitForm />
        </div>
      </div>
    </main>
  )
}
