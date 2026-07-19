# Pendências — Site LFTEAM

Site no ar: https://lfteam-site.vercel.app
Projeto na Vercel: `lfteam-site` (conta `jvitorborges`)
Última atualização deste arquivo: 18/07/2026

---

## 1. Depoimentos reais (bloqueia divulgação forte)

A seção de depoimentos está **comentada** no [`index.html`](index.html), procure por
`SEÇÃO DE DEPOIMENTOS — OCULTA ATÉ TER RELATOS REAIS`.

Os três textos que estão lá dentro são **exemplos escritos na fase de mockup**, não são
falas reais de alunas. Foram escondidos justamente por isso.

**Para reativar:** troque as três citações pelos relatos verdadeiros e remova as marcas
de comentário (`<!--` e `-->`) que envolvem a seção.

> Prova social é o que mais converte numa página de vendas. Enquanto isso estiver
> escondido, o site funciona, mas perde força.

---

## 2. Domínio próprio (`lfteam.com.br`)

Ainda não registrado. A consulta pela Vercel deu "indisponível", mas isso é ambíguo:
pode ser que já esteja registrado por outra pessoa **ou** que a Vercel simplesmente não
venda `.com.br` (esse domínio é controlado pelo Registro.br).

**Para confirmar:** buscar em https://registro.br — o registro tem que ser feito lá,
não pela Vercel. Depois é só apontar o domínio para o projeto.

### ⚠️ Ao trocar o domínio, atualizar em 5 lugares

Se ficar meio trocado, o Google enxerga dois endereços disputando o mesmo conteúdo, o
que é **pior do que não ter domínio próprio**. Todos apontam hoje para
`https://lfteam-site.vercel.app`:

| # | Onde | O quê |
|---|------|-------|
| 1 | `index.html` — `<head>` | `<link rel="canonical">` |
| 2 | `index.html` — `<head>` | `og:url` |
| 3 | `index.html` — `<head>` | `og:image` e `twitter:image` |
| 4 | `index.html` — dados estruturados | `@id`, `url` e `image` do bloco `ProfessionalService` |
| 5 | `sitemap.xml` e `robots.txt` | endereço do site e do sitemap |

Comando para achar todas de uma vez:

```bash
grep -rn "lfteam-site.vercel.app" index.html sitemap.xml robots.txt
```

Depois de trocar, testar a prévia de compartilhamento colando o link novo numa conversa
do WhatsApp — se aparecer retângulo cinza, alguma URL ficou errada.

---

## 3. Perfil da Empresa no Google (maior ganho de SEO local)

**Não é coisa de código — precisa ser feito pelo Luis Fernando.**

O site já tem os dados estruturados dizendo ao Google que o negócio fica em
Olho D'Água das Cunhãs/MA. Mas para aparecer no **mapa e no pacote local** (aqueles
resultados com estrelinhas e endereço), é preciso criar o perfil gratuito em
https://business.google.com — a verificação costuma ser por telefone ou carta.

A marcação do site **reforça** esse perfil, mas não substitui.

---

## 4. Eventos do Analytics — conferir os primeiros números

O Vercel Analytics está ativo e **confirmado coletando** (visitas e cliques no WhatsApp).

Cada clique registra de qual seção veio (hero, planos, FAQ...), o que responde a pergunta
que importa: *não é só quantas visitas, é onde a pessoa decide falar com ele.*

Ver em: https://vercel.com/jvitorborges-projects/lfteam-site/analytics

> **Descontar 1 visita e 1 clique** dos primeiros números — foram gerados no teste
> de validação em 18/07/2026.

---

## 5. Dados que ficaram de fora de propósito

Não foram marcados nos dados estruturados por não serem conhecidos. **Inventar seria
pior que omitir** — dado falso em marcação derruba a confiança do site na busca.

- Endereço de rua
- Coordenadas de GPS
- Horário de funcionamento
- Preços dos planos (decisão de negócio: o valor é combinado no WhatsApp)

Se o Luis quiser divulgar horário de atendimento ou endereço, dá para acrescentar.

---

## 6. Hospedagem: plano Hobby está fora dos termos ⚠️

**Status: em aberto por decisão consciente (18/07/2026) — não é esquecimento.**

A Vercel proíbe uso comercial no plano grátis. A definição
([Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)) é ampla:

> qualquer deploy usado para ganho financeiro de **qualquer pessoa envolvida na produção
> do projeto, incluindo um consultor pago escrevendo o código**

Ou seja: **todo site de cliente é uso comercial**, mesmo institucional que não vende nada.
O fato de ter sido um trabalho pago já enquadra. O correto seria o plano Pro
(US$ 20/mês, ~R$ 110).

### Opções

| Caminho | Custo | Observação |
|---|---|---|
| **Vercel Pro** | ~R$110/mês | Regulariza e mantém tudo como está. Cobre projetos ilimitados — dilui se hospedar outros clientes. |
| **Cloudflare Pages** | Grátis | Permite uso comercial, banda ilimitada. Migração simples (site é HTML puro). |
| **Netlify** | Grátis | Também permite comercial, 100 GB de banda. |

### Por que ficou pausado

Se a **Fase 2** (área do aluno) acontecer, ela precisa de login, banco de dados e
gateway — exatamente o que a Vercel faz de melhor, e aí o Pro passa a se justificar.
Migrar pro Cloudflare agora e voltar depois seria trabalho jogado fora.

**Risco enquanto isso:** baixo na prática (a Vercel raramente age contra site pequeno),
mas existe. Se chegar e-mail deles pedindo upgrade, é isso.

**Decidir quando:** souber se a Fase 2 sai ou não.

### Se migrar para o Cloudflare Pages

O site é HTML puro, então é só republicar. O que muda:

- O código do Analytics é específico da Vercel — trocar pelo equivalente do Cloudflare
  (também gratuito e sem cookies, mantém a compatibilidade com LGPD)
- O rastreio de cliques no WhatsApp (`window.va` no [`script.js`](script.js)) precisa ser
  reescrito para a API do Cloudflare
- Atualizar as URLs listadas no item 2 deste arquivo

---

## 7. Fase 2 (área do aluno) — é outro contrato

**Não é continuação da Fase 1. Precisa ser tratado como projeto separado.**

Escopo levantado na fase de planejamento: login de aluno, ver treino e dieta, registro de
progresso, gráfico de evolução, biblioteca de vídeos, status de pagamento. Mais o painel
de gestão (Fase 3).

### Por que separar

O site atual é estático: arquivos prontos, nada rodando no servidor, nenhum dado de
terceiro guardado. A Fase 2 muda isso por completo:

- **Dados sensíveis de alunas** — peso, medidas, fotos de progresso, restrições de saúde.
  Passa a haver responsabilidade de LGPD de verdade, não só a cortesia de não usar cookie.
- **Gateway de pagamento** — envolve dinheiro de terceiros. Outro nível de
  responsabilidade e de exigência técnica.
- **Manutenção contínua** — sistema com login não é "entrega e acabou". Tem atualização
  de segurança, backup, suporte quando quebra.

### Antes de orçar, confirmar com o Luis

Uma dúvida ficou em aberto lá no levantamento inicial e **nunca foi resolvida**: ele já
usa apps prontos para prescrever treino e dieta (mencionou "muito app espalhado"). Vale
decidir se a Fase 2 **substitui** essas ferramentas ou **convive** com elas — isso muda o
escopo inteiro e o preço.

---

## Como mexer no site

Estrutura simples, sem framework nem build:

```
index.html     conteúdo e dados estruturados
style.css      estilos
script.js      menu, carrosséis, animações e rastreio de cliques
imagens/       .webp são as usadas no site; .jpg são os originais
favicon.svg    ícone da aba
```

**Publicar alterações:**

```bash
cd C:\Users\JV\Desktop\lfteam-site
vercel deploy --prod
```

### Se trocar alguma imagem

As fotos do site são `.webp` (64% mais leves que os originais). Para converter uma nova:

```bash
npm install sharp --no-save
node -e "require('sharp')('imagens/NOVA.jpg').webp({quality:82}).toFile('imagens/NOVA.webp')"
```

O `node_modules` já está no `.vercelignore`, então não sobe no deploy.

### Ao adicionar seções novas

Se criar uma seção nova, coloque `class="reveal"` nos blocos de conteúdo para manter a
animação de entrada, e adicione o link no menu **e** no painel do celular
(`nav-mobile-panel`) — são duas listas separadas no HTML.
