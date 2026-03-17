import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    "postgresql://m5labs:m5labs123@vps.m5-labs.com:5432/m5labs_db?sslmode=disable",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: "Ana Souza",
        phoneNumber: "+55 11 99001-2345",
        email: "ana.souza@email.com",
        company: "Acme Corp",
        notes: "Parceira estratégica, prefere contato por WhatsApp.",
      },
    }),
    prisma.contact.create({
      data: {
        name: "Carlos Mendes",
        phoneNumber: "+55 21 98765-4321",
        email: "carlos@startup.io",
        company: "Startup IO",
        notes: "Investidor anjo, interesse em IA.",
      },
    }),
    prisma.contact.create({
      data: {
        name: "Beatriz Lima",
        phoneNumber: "+55 31 97654-3210",
        email: "beatriz.lima@design.co",
        company: "Design Co.",
      },
    }),
    prisma.contact.create({
      data: {
        name: "Rafael Torres",
        phoneNumber: "+55 51 96543-2109",
        email: "rafael@agencia.com.br",
        company: "Agência Digital",
        notes: "Reunião mensal toda primeira sexta.",
      },
    }),
    prisma.contact.create({
      data: {
        name: "Juliana Costa",
        email: "ju.costa@consulting.com",
        company: "JC Consulting",
      },
    }),
  ]);

  // Conversations
  const conv = [
    // Ana
    { contactId: contacts[0].id, messageText: "Oi Ana! Tudo bem? Podemos marcar uma call essa semana?", direction: "outbound", daysAgo: 3 },
    { contactId: contacts[0].id, messageText: "Claro! Quinta de manhã está ótimo pra mim.", direction: "inbound", daysAgo: 3 },
    { contactId: contacts[0].id, messageText: "Quinta às 10h então. Vou enviar o invite.", direction: "outbound", daysAgo: 3 },
    { contactId: contacts[0].id, messageText: "Perfeito, obrigada!", direction: "inbound", daysAgo: 2 },
    // Carlos
    { contactId: contacts[1].id, messageText: "Carlos, você tem interesse em conhecer o produto?", direction: "outbound", daysAgo: 7 },
    { contactId: contacts[1].id, messageText: "Com certeza! Me manda um deck.", direction: "inbound", daysAgo: 7 },
    { contactId: contacts[1].id, messageText: "Enviado! Aguardo seu feedback.", direction: "outbound", daysAgo: 6 },
    { contactId: contacts[1].id, messageText: "Gostei muito. Vamos agendar uma conversa mais detalhada?", direction: "inbound", daysAgo: 1 },
    // Beatriz
    { contactId: contacts[2].id, messageText: "Bea, o projeto de branding ficou incrível!", direction: "outbound", daysAgo: 5 },
    { contactId: contacts[2].id, messageText: "Obrigada! Precisa de algum ajuste?", direction: "inbound", daysAgo: 5 },
    { contactId: contacts[2].id, messageText: "Não, está perfeito. Posso te recomendar para outros clientes.", direction: "outbound", daysAgo: 4 },
    // Rafael
    { contactId: contacts[3].id, messageText: "Rafael, confirmado a reunião de sexta?", direction: "outbound", daysAgo: 2 },
    { contactId: contacts[3].id, messageText: "Confirmado! Às 9h na sala virtual.", direction: "inbound", daysAgo: 2 },
  ];

  for (const c of conv) {
    const date = new Date();
    date.setDate(date.getDate() - c.daysAgo);
    await prisma.conversation.create({
      data: {
        contactId: c.contactId,
        messageText: c.messageText,
        direction: c.direction,
        timestamp: date,
      },
    });
  }

  // Notes
  await Promise.all([
    prisma.note.create({
      data: {
        title: "Estratégia Q2 2026",
        content:
          "<h2>Objetivos do Trimestre</h2><ul><li>Fechar 5 novos clientes enterprise</li><li>Lançar versão 2.0 do produto</li><li>Expandir equipe de vendas</li></ul><p>Foco principal em <strong>parcerias estratégicas</strong> com empresas do segmento financeiro.</p>",
      },
    }),
    prisma.note.create({
      data: {
        title: "Reunião com Acme Corp",
        content:
          "<p>Pontos discutidos na call de quinta:</p><ul><li>Proposta de integração via API</li><li>SLA de 99.9% exigido</li><li>Prazo de implementação: 45 dias</li></ul><p><strong>Próximos passos:</strong> enviar proposta formal até sexta-feira.</p>",
      },
    }),
    prisma.note.create({
      data: {
        title: "Ideias para o produto",
        content:
          "<h2>Features Backlog</h2><ol><li>Dashboard de analytics avançado</li><li>Integração com WhatsApp Business</li><li>Relatórios automáticos por email</li><li>App mobile</li></ol>",
      },
    }),
    prisma.note.create({
      data: {
        title: "Pitch Deck — notas",
        content:
          "<p>Melhorias para o deck de investidores:</p><ul><li>Adicionar slide de tração (crescimento MoM)</li><li>Atualizar TAM/SAM/SOM</li><li>Incluir depoimentos de clientes</li></ul>",
      },
    }),
  ]);

  // Tasks
  await Promise.all([
    prisma.task.create({ data: { title: "Enviar proposta para Acme Corp", description: "Incluir SLA e cronograma de implementação", status: "Todo", position: 0 } }),
    prisma.task.create({ data: { title: "Preparar deck para reunião de sexta", status: "Todo", position: 1 } }),
    prisma.task.create({ data: { title: "Contratar designer UX", description: "Abrir vaga no LinkedIn e Workana", status: "Todo", position: 2 } }),
    prisma.task.create({ data: { title: "Revisar contrato com Startup IO", description: "Verificar cláusulas de exclusividade", status: "In Progress", position: 0 } }),
    prisma.task.create({ data: { title: "Configurar pipeline de CI/CD", status: "In Progress", position: 1 } }),
    prisma.task.create({ data: { title: "Definir metas Q2", description: "Alinhamento com time de produto e vendas", status: "In Progress", position: 2 } }),
    prisma.task.create({ data: { title: "Onboarding cliente Design Co.", status: "Done", position: 0 } }),
    prisma.task.create({ data: { title: "Criar landing page do produto", status: "Done", position: 1 } }),
    prisma.task.create({ data: { title: "Integração com Stripe", description: "Pagamentos recorrentes e one-time", status: "Done", position: 2 } }),
  ]);

  console.log("✅ Seed concluído:");
  console.log(`   ${contacts.length} contatos`);
  console.log(`   ${conv.length} mensagens`);
  console.log("   4 notas");
  console.log("   9 tasks");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
