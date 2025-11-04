import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 md:py-32 flex-1 w-full">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            About <span className="text-primary">HowMuchAh?</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our expense tracking service
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1" className="w-full">
            <AccordionTrigger>Placeholder1</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <p>
                For future
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      <Footer />
    </div>
  )
}

export default About