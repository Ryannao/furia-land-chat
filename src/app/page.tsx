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
Este chatbot, alimentado por IA, traz respostas rápidas e precisas sobre a FURIA. 
Descubra tudo sobre os jogadores, jogos e curiosidades, sempre com a pegada do universo esports. 
Informação direta e sempre atualizada, com a inteligência de quem conhece o time.
      </SectionTitle>

      <Benefits data={benefitOne} />
      
    </Container>
  );
}
