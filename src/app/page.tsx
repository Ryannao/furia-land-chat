import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { benefitOne } from "@/components/data";

export default function Home() {
  return (
    <Container>
      <Hero />
      <SectionTitle
        title=" O que você encontra aqui"
      >
Com esse chatbot, alimentado por IA, traz respostas rápidas e precisas sobre a FURIA. 
Descubra tudo sobre os jogadores, jogos e curiosidades, sempre com a pegada do universo esports. 
Informação direta e sempre atualizada.

      </SectionTitle>

<div className="mt-10 flex items-center justify-center text-white opacity-75 text-base space-x-2">
  <span>Só clicar nesse ícone:</span>
  <div className="w-8 h-8 bg-blue-900 flex items-center justify-center rounded-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </div>
  <span>e acessar!</span>
</div>


      <Benefits data={benefitOne} />
      
    </Container>
  );
}
