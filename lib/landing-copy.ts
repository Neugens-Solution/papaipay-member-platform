export type LandingCopy = {
  locale: "en" | "ms";
  navigationLabel: string;
  nav: Array<{ label: string; href: string }>;
  login: string;
  requestAccess: string;
  languageLabel: string;
  hero: { kicker: string; title: string; body: string; primary: string; secondary: string; note: string; imageAlt: string; imageCaption: string };
  facts: Array<{ value: string; label: string; detail: string }>;
  model: { kicker: string; title: string; intro: string; steps: Array<{ title: string; body: string }> };
  risk: { kicker: string; title: string; body: string; points: Array<{ title: string; body: string }>; disclosureTitle: string; disclosure: string };
  returns: { kicker: string; title: string; body: string; holdingLabel: string; holdingValue: string; holdingTitle: string; holdingBody: string; profitLabel: string; profitValue: string; profitTitle: string; profitBody: string; terms: string };
  protection: { label: string; value: string; unit: string; title: string; body: string; note: string };
  opportunities: { kicker: string; title: string; body: string; types: Array<{ title: string; body: string }>; detail: string; cta: string };
  journey: { kicker: string; title: string; steps: Array<{ title: string; body: string }> };
  faq: { kicker: string; title: string; items: Array<{ question: string; answer: string }> };
  finalCta: { kicker: string; title: string; body: string; primary: string; secondary: string };
  footer: { description: string; disclosure: string; rights: string; admin: string };
};

const en: LandingCopy = {
  locale: "en",
  navigationLabel: "Public navigation",
  nav: [
    { label: "What we do", href: "#model" },
    { label: "Property market", href: "#returns" },
    { label: "Our approach", href: "#protection" },
    { label: "Opportunities", href: "#opportunities" },
    { label: "FAQ", href: "#faq" },
  ],
  login: "Member login",
  requestAccess: "Request access",
  languageLabel: "Language",
  hero: {
    kicker: "K Asset Ventures by PICM Sdn Bhd",
    title: "Turning selected property opportunities into managed projects.",
    body: "K Asset Ventures identifies selected residential properties, assesses their market potential, coordinates improvement where appropriate and manages each project towards its intended exit strategy.",
    primary: "Explore K Asset Ventures",
    secondary: "Member login",
    note: "Specific participation terms and financial information are available only to registered and approved members.",
    imageAlt: "Malaysian residential property exterior",
    imageCaption: "Property selection · Assessment · Improvement · Project management",
  },
  facts: [
    { value: "KAV", label: "Property-focused platform", detail: "Built around selected Malaysian residential property projects" },
    { value: "01", label: "Disciplined assessment", detail: "Location, condition, market context, costs and exit planning are considered" },
    { value: "02", label: "Member access", detail: "Specific opportunity and participation details remain inside the member portal" },
  ],
  model: {
    kicker: "What K Asset Ventures does",
    title: "From property identification to project execution.",
    intro: "K Asset Ventures focuses on residential property opportunities where acquisition, improvement and market positioning can be managed through a structured project process.",
    steps: [
      { title: "Identify", body: "Source selected residential properties, including auction opportunities, for further assessment." },
      { title: "Assess", body: "Review location, property condition, indicative market context, legal considerations, estimated costs and the intended project path." },
      { title: "Improve", body: "Coordinate practical repairs or improvements where these support the property’s condition and marketability." },
      { title: "Manage", body: "Monitor the property project through its planned holding and exit process, subject to the circumstances of each property." },
    ],
  },
  risk: {
    kicker: "A more controlled approach",
    title: "Property projects managed with structure, due diligence and clear project information.",
    body: "Property projects involve risk and outcomes can vary. K Asset Ventures focuses on disciplined assessment and ongoing project management rather than presenting property outcomes as guaranteed.",
    points: [
      { title: "A physical underlying property", body: "Each project is connected to an identifiable residential property and its specific circumstances." },
      { title: "Assessment before execution", body: "Location, condition, indicative market context, costs and project considerations are reviewed before a property progresses." },
      { title: "Planned improvement", body: "Repairs and improvements may be carried out where they support the property’s condition and intended market positioning." },
      { title: "Project monitoring", body: "Progress, documents and relevant project updates can be communicated through the member experience." },
    ],
    disclosureTitle: "Property projects carry risk",
    disclosure: "Property values, legal timelines, repair costs, market conditions and buyer demand may change. Members should review the information and documents for each specific opportunity before making any decision.",
  },
  returns: {
    kicker: "Malaysia property market",
    title: "Property decisions start with market context.",
    body: "K Asset Ventures considers the wider Malaysian residential property environment together with property-specific information. Public market content is intended to provide context; specific opportunity terms remain within the member portal.",
    holdingLabel: "Market perspective",
    holdingValue: "MY",
    holdingTitle: "Residential property context",
    holdingBody: "Location, comparable properties, accessibility, neighbourhood characteristics and buyer demand can all influence how an individual property is assessed.",
    profitLabel: "Opportunity perspective",
    profitValue: "KAV",
    profitTitle: "Auction and project context",
    profitBody: "Auction terms, property condition, estimated improvement needs and the intended exit path are considered at project level rather than relying on headline market movements alone.",
    terms: "Market information is general and does not represent a promise of property value, project outcome, return or repayment.",
  },
  protection: {
    label: "Project approach",
    value: "4",
    unit: "stages",
    title: "Selection, assessment, improvement and management—not a guarantee of outcome.",
    body: "K Asset Ventures applies a structured property-project process while recognising that market conditions, costs, timelines and sale outcomes can change.",
    note: "Detailed participation terms, project documents, financial information and relevant risk disclosures are provided to approved members for the specific opportunity.",
  },
  opportunities: {
    kicker: "Property opportunities",
    title: "Selected residential projects for approved members to review.",
    body: "Suitable residential properties may be introduced after completing the relevant assessment process. Approved members can review the information made available for each specific opportunity inside the member portal.",
    types: [
      { title: "Terrace and landed homes", body: "Residential properties considered in the context of condition, location, marketability and improvement requirements." },
      { title: "Apartments and urban residences", body: "Selected residential units assessed according to the circumstances of the property and surrounding market." },
      { title: "Established and growth locations", body: "Projects may be considered across different locations based on property-specific assessment and market context." },
    ],
    detail: "Financial terms, participation conditions, project documents and specific risk information are restricted to registered and approved members.",
    cta: "View member opportunities",
  },
  journey: {
    kicker: "Member journey",
    title: "A clear path to reviewing a property opportunity.",
    steps: [
      { title: "Register", body: "Create an account and complete the required member information." },
      { title: "Review", body: "Access the available property information, documents, terms and risk disclosures." },
      { title: "Decide", body: "Consider the specific opportunity information before choosing whether to participate." },
      { title: "Track", body: "Follow relevant project information and updates through the portal." },
      { title: "Review updates", body: "See confirmed project and distribution records when applicable." },
    ],
  },
  faq: {
    kicker: "Frequently asked questions",
    title: "Understanding K Asset Ventures.",
    items: [
      { question: "What is K Asset Ventures?", answer: "K Asset Ventures by PICM Sdn Bhd is a property-focused platform for selected residential property projects. It supports the process from property identification and assessment through project management and the intended exit strategy." },
      { question: "What types of properties does K Asset Ventures consider?", answer: "The focus is on selected residential properties, including suitable auction opportunities, subject to the assessment carried out for each property." },
      { question: "How are properties assessed?", answer: "Assessment may consider location, property condition, indicative market context, legal considerations, estimated project costs, improvement needs and the intended project path." },
      { question: "Where can I see participation and financial terms?", answer: "Specific participation terms, financial information, project documents and relevant risk disclosures are available only to registered and approved members inside the member portal." },
      { question: "Are property outcomes guaranteed?", answer: "No. Property values, costs, timelines, market conditions, buyer demand and project outcomes can change. Members should review the information and documents for each opportunity before making a decision." },
      { question: "Who can access member opportunities?", answer: "Opportunity details are intended for registered and approved members who have completed the required account and verification steps." },
    ],
  },
  finalCta: {
    kicker: "K Asset Ventures member access",
    title: "Explore selected property opportunities inside the member portal.",
    body: "Approved members can review specific project information, documents, terms and relevant disclosures in a structured member experience.",
    primary: "Request access",
    secondary: "Member login",
  },
  footer: {
    description: "K Asset Ventures by PICM Sdn Bhd",
    disclosure: "Information on this public page is general and for informational purposes. Property projects involve risk and outcomes are not guaranteed. Specific opportunity information, terms and risk disclosures should be reviewed before any participation decision.",
    rights: "All rights reserved.",
    admin: "Admin access",
  },
};

const ms: LandingCopy = {
  locale: "ms",
  navigationLabel: "Navigasi awam",
  nav: [
    { label: "Apa yang kami lakukan", href: "#model" },
    { label: "Pasaran hartanah", href: "#returns" },
    { label: "Pendekatan kami", href: "#protection" },
    { label: "Peluang", href: "#opportunities" },
    { label: "Soalan lazim", href: "#faq" },
  ],
  login: "Log masuk ahli",
  requestAccess: "Mohon akses",
  languageLabel: "Bahasa",
  hero: {
    kicker: "K Asset Ventures by PICM Sdn Bhd",
    title: "Mengurus peluang hartanah terpilih sebagai projek yang tersusun.",
    body: "K Asset Ventures mengenal pasti hartanah kediaman terpilih, menilai potensi pasarannya, menyelaras penambahbaikan apabila bersesuaian dan mengurus setiap projek ke arah strategi keluar yang dirancang.",
    primary: "Kenali K Asset Ventures",
    secondary: "Log masuk ahli",
    note: "Terma penyertaan khusus dan maklumat kewangan hanya tersedia kepada ahli yang berdaftar dan diluluskan.",
    imageAlt: "Hartanah kediaman di Malaysia",
    imageCaption: "Pemilihan hartanah · Penilaian · Penambahbaikan · Pengurusan projek",
  },
  facts: [
    { value: "KAV", label: "Platform berfokus hartanah", detail: "Berteraskan projek hartanah kediaman terpilih di Malaysia" },
    { value: "01", label: "Penilaian berdisiplin", detail: "Lokasi, keadaan, konteks pasaran, kos dan pelan keluar dipertimbangkan" },
    { value: "02", label: "Akses ahli", detail: "Maklumat khusus peluang dan penyertaan kekal dalam portal ahli" },
  ],
  model: {
    kicker: "Apa yang K Asset Ventures lakukan",
    title: "Daripada mengenal pasti hartanah hingga pelaksanaan projek.",
    intro: "K Asset Ventures memberi tumpuan kepada peluang hartanah kediaman yang boleh diurus melalui proses projek yang tersusun meliputi pemerolehan, penambahbaikan dan kedudukan pasaran.",
    steps: [
      { title: "Kenal pasti", body: "Mencari hartanah kediaman terpilih, termasuk peluang lelong, untuk penilaian lanjut." },
      { title: "Nilai", body: "Meneliti lokasi, keadaan hartanah, konteks pasaran indikatif, pertimbangan undang-undang, anggaran kos dan laluan projek." },
      { title: "Tambah baik", body: "Menyelaras pembaikan atau penambahbaikan praktikal apabila ia menyokong keadaan dan kebolehpasaran hartanah." },
      { title: "Urus", body: "Memantau projek hartanah sepanjang proses pegangan dan strategi keluar yang dirancang, tertakluk kepada keadaan setiap hartanah." },
    ],
  },
  risk: {
    kicker: "Pendekatan yang lebih terkawal",
    title: "Projek hartanah diurus dengan struktur, penelitian dan maklumat projek yang jelas.",
    body: "Projek hartanah mempunyai risiko dan hasilnya boleh berbeza. K Asset Ventures memberi tumpuan kepada penilaian berdisiplin dan pengurusan projek berterusan, bukan menggambarkan hasil hartanah sebagai sesuatu yang dijamin.",
    points: [
      { title: "Hartanah fizikal yang dikenal pasti", body: "Setiap projek berkait dengan hartanah kediaman tertentu serta keadaan khusus hartanah tersebut." },
      { title: "Penilaian sebelum pelaksanaan", body: "Lokasi, keadaan, konteks pasaran indikatif, kos dan pertimbangan projek diteliti sebelum sesuatu hartanah diteruskan." },
      { title: "Penambahbaikan terancang", body: "Pembaikan dan penambahbaikan boleh dilaksanakan apabila ia menyokong keadaan hartanah serta kedudukan pasaran yang dirancang." },
      { title: "Pemantauan projek", body: "Kemajuan, dokumen dan maklumat projek yang berkaitan boleh disampaikan melalui pengalaman ahli." },
    ],
    disclosureTitle: "Projek hartanah mempunyai risiko",
    disclosure: "Nilai hartanah, tempoh undang-undang, kos pembaikan, keadaan pasaran dan permintaan pembeli boleh berubah. Ahli perlu meneliti maklumat serta dokumen bagi setiap peluang khusus sebelum membuat keputusan.",
  },
  returns: {
    kicker: "Pasaran hartanah Malaysia",
    title: "Keputusan hartanah bermula dengan memahami konteks pasaran.",
    body: "K Asset Ventures mempertimbangkan persekitaran hartanah kediaman Malaysia bersama maklumat khusus setiap hartanah. Kandungan pasaran awam bertujuan memberi konteks; terma peluang khusus kekal dalam portal ahli.",
    holdingLabel: "Perspektif pasaran",
    holdingValue: "MY",
    holdingTitle: "Konteks hartanah kediaman",
    holdingBody: "Lokasi, hartanah perbandingan, akses, ciri kejiranan dan permintaan pembeli boleh mempengaruhi bagaimana sesuatu hartanah dinilai.",
    profitLabel: "Perspektif peluang",
    profitValue: "KAV",
    profitTitle: "Konteks lelong dan projek",
    profitBody: "Terma lelong, keadaan hartanah, anggaran keperluan penambahbaikan dan laluan keluar yang dirancang dipertimbangkan pada peringkat projek, bukan berdasarkan pergerakan pasaran umum semata-mata.",
    terms: "Maklumat pasaran adalah bersifat umum dan bukan janji terhadap nilai hartanah, hasil projek, pulangan atau pembayaran balik.",
  },
  protection: {
    label: "Pendekatan projek",
    value: "4",
    unit: "peringkat",
    title: "Pemilihan, penilaian, penambahbaikan dan pengurusan—bukan jaminan hasil.",
    body: "K Asset Ventures menggunakan proses projek hartanah yang tersusun sambil mengambil kira bahawa keadaan pasaran, kos, tempoh dan hasil jualan boleh berubah.",
    note: "Terma penyertaan terperinci, dokumen projek, maklumat kewangan dan pendedahan risiko berkaitan disediakan kepada ahli yang diluluskan bagi peluang khusus tersebut.",
  },
  opportunities: {
    kicker: "Peluang hartanah",
    title: "Projek kediaman terpilih untuk penelitian ahli yang diluluskan.",
    body: "Hartanah kediaman yang bersesuaian boleh diperkenalkan selepas melalui proses penilaian berkaitan. Ahli yang diluluskan boleh meneliti maklumat yang disediakan bagi setiap peluang khusus dalam portal ahli.",
    types: [
      { title: "Rumah teres dan kediaman bertanah", body: "Hartanah kediaman dipertimbangkan berdasarkan keadaan, lokasi, kebolehpasaran dan keperluan penambahbaikan." },
      { title: "Apartmen dan kediaman bandar", body: "Unit kediaman terpilih dinilai mengikut keadaan hartanah serta pasaran di sekitarnya." },
      { title: "Lokasi matang dan sedang berkembang", body: "Projek boleh dipertimbangkan di lokasi berbeza berdasarkan penilaian khusus hartanah dan konteks pasaran." },
    ],
    detail: "Terma kewangan, syarat penyertaan, dokumen projek dan maklumat risiko khusus dihadkan kepada ahli yang berdaftar dan diluluskan.",
    cta: "Lihat peluang untuk ahli",
  },
  journey: {
    kicker: "Perjalanan ahli",
    title: "Laluan yang jelas untuk meneliti sesuatu peluang hartanah.",
    steps: [
      { title: "Daftar", body: "Cipta akaun dan lengkapkan maklumat ahli yang diperlukan." },
      { title: "Teliti", body: "Akses maklumat hartanah, dokumen, terma dan pendedahan risiko yang tersedia." },
      { title: "Buat keputusan", body: "Pertimbangkan maklumat khusus peluang sebelum memilih sama ada mahu menyertai." },
      { title: "Pantau", body: "Ikuti maklumat dan perkembangan projek yang berkaitan melalui portal." },
      { title: "Semak kemas kini", body: "Lihat rekod projek dan agihan yang telah disahkan apabila berkenaan." },
    ],
  },
  faq: {
    kicker: "Soalan lazim",
    title: "Memahami K Asset Ventures.",
    items: [
      { question: "Apakah K Asset Ventures?", answer: "K Asset Ventures by PICM Sdn Bhd ialah platform berfokus hartanah untuk projek hartanah kediaman terpilih. Ia menyokong proses daripada pengenalpastian dan penilaian hartanah hingga pengurusan projek serta strategi keluar yang dirancang." },
      { question: "Apakah jenis hartanah yang dipertimbangkan?", answer: "Fokus adalah pada hartanah kediaman terpilih, termasuk peluang lelong yang bersesuaian, tertakluk kepada penilaian bagi setiap hartanah." },
      { question: "Bagaimanakah hartanah dinilai?", answer: "Penilaian boleh mengambil kira lokasi, keadaan hartanah, konteks pasaran indikatif, pertimbangan undang-undang, anggaran kos projek, keperluan penambahbaikan dan laluan projek yang dirancang." },
      { question: "Di manakah saya boleh melihat terma penyertaan dan maklumat kewangan?", answer: "Terma penyertaan khusus, maklumat kewangan, dokumen projek dan pendedahan risiko berkaitan hanya tersedia kepada ahli yang berdaftar dan diluluskan dalam portal ahli." },
      { question: "Adakah hasil projek hartanah dijamin?", answer: "Tidak. Nilai hartanah, kos, tempoh, keadaan pasaran, permintaan pembeli dan hasil projek boleh berubah. Ahli perlu meneliti maklumat dan dokumen setiap peluang sebelum membuat keputusan." },
      { question: "Siapa yang boleh mengakses peluang ahli?", answer: "Maklumat peluang disediakan untuk ahli yang berdaftar dan diluluskan serta telah melengkapkan langkah akaun dan pengesahan yang diperlukan." },
    ],
  },
  finalCta: {
    kicker: "Akses ahli K Asset Ventures",
    title: "Terokai peluang hartanah terpilih dalam portal ahli.",
    body: "Ahli yang diluluskan boleh meneliti maklumat projek khusus, dokumen, terma dan pendedahan berkaitan melalui pengalaman ahli yang tersusun.",
    primary: "Mohon akses",
    secondary: "Log masuk ahli",
  },
  footer: {
    description: "K Asset Ventures by PICM Sdn Bhd",
    disclosure: "Maklumat pada halaman awam ini bersifat umum dan untuk tujuan maklumat. Projek hartanah mempunyai risiko dan hasilnya tidak dijamin. Maklumat, terma dan pendedahan risiko bagi peluang khusus perlu diteliti sebelum sebarang keputusan penyertaan.",
    rights: "Hak cipta terpelihara.",
    admin: "Akses pentadbir",
  },
};

export const landingCopy = { en, ms } as const;
