export function Timeline() {
  const events = [
    {
      date: "01/03/2025",
      title: "Snapshot de Elegibilidade",
      description: "Data limite para interações com o ecossistema Street Dog Coin para ser elegível ao airdrop.",
    },
    {
      date: "15/03/2025",
      title: "Início do Airdrop",
      description: "Lançamento oficial do airdrop. Usuários elegíveis podem começar a reivindicar seus tokens.",
    },
    {
      date: "15/05/2025",
      title: "Fim do Período de Reivindicação",
      description:
        "Último dia para reivindicar tokens do airdrop. Tokens não reivindicados serão redirecionados para o tesouro da comunidade.",
    },
    {
      date: "01/06/2025",
      title: "Listagem em Exchanges",
      description: "Tokens $SDC serão listados em exchanges descentralizadas e centralizadas.",
    },
  ]

  return (
    <div className="relative border-l border-muted-foreground/20 pl-6 ml-4">
      {events.map((event, index) => (
        <div key={index} className="mb-10 relative">
          <div className="absolute w-4 h-4 bg-primary rounded-full -left-[30px] top-1"></div>
          <div className="text-sm text-muted-foreground mb-1">{event.date}</div>
          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
      ))}
    </div>
  )
}

