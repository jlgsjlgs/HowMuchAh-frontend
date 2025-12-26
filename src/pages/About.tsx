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
        >
          <AccordionItem value="item-1" className="w-full">
            <AccordionTrigger>Do I need to pay to use the application?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <p>
                Nope! It's completely free!
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="w-full">
            <AccordionTrigger>How do I gain access to the application?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <p>
                You can contact the developer. However, the application is currently only available for closed invitation-only testing (as of 26/12/2025).
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="w-full">
            <AccordionTrigger>How do I report a bug, or request for a feature?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <p>
                You can either contact the developer or open an issue at the <u><a href="https://github.com/jlgsjlgs/HowMuchAh-frontend/issues">GitHub Repository</a></u> for the project.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="w-full">
            <AccordionTrigger>What is the tech stack used for the project?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <p>
                React and Spring Boot.
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