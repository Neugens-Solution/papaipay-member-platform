export type LandingCopy = {
  locale: "en" | "ms";
  navigationLabel: string;
  nav: Array<{ label: string; href: string }>;
  login: string;
  requestAccess: string;
  languageLabel: string;
  hero: {
    kicker: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
    note: string;
    imageAlt: string;
    imageCaption: string;
  };
  facts: Array<{ value: string; label: string; detail: string }>;
  model: {
    kicker: string;
    title: string;
    intro: string;
    steps: Array<{ title: string; body: string }>;
  };
  risk: {
    kicker: string;
    title: string;
    body: string;
    points: Array<{ title: string; body: string }>;
    disclosureTitle: string;
    disclosure: string;
  };
  returns: {
    kicker: string;
    title: string;
    body: string;
    holdingLabel: string;
    holdingValue: string;
    holdingTitle: string;
    holdingBody: string;
    profitLabel: string;
    profitValue: string;
    profitTitle: string;
    profitBody: string;
    terms: string;
  };
  protection: {
    label: string;
    value: string;
    unit: string;
    title: string;
    body: string;
    note: string;
  };
  opportunities: {
    kicker: string;
    title: string;
    body: string;
    types: Array<{ title: string; body: string }>;
    detail: string;
    cta: string;
  };
  journey: {
    kicker: string;
    title: string;
    steps: Array<{ title: string; body: string }>;
  };
  faq: {
    kicker: string;
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    kicker: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
  };
  footer: {
    description: string;
    disclosure: string;
    rights: string;
    admin: string;
  };
};

const en: LandingCopy = {
  locale: "en",
  navigationLabel: "Public navigation",
  nav: [
    { label: "Why auction property", href: "#model" },
    { label: "Returns", href: "#returns" },
    { label: "Protection", href: "#protection" },
    { label: "Opportunities", href: "#opportunities" },
    { label: "FAQ", href: "#faq" },
  ],
  login: "Member login",
  requestAccess: "Request access",
  languageLabel: "Language",
  hero: {
    kicker: "Private access to selected residential projects",
    title: "Build income through selected auction property opportunities.",
    body: "Participate in carefully selected residential property projects and earn a monthly holding return while each asset is prepared and positioned for sale.",
    primary: "Explore opportunities",
    secondary: "Member login",
    note: "Opportunity details are available to registered and approved members.",
    imageAlt: "Illustrative Malaysian residential property exterior",
    imageCaption: "Selected residential property · Managed from acquisition to sale",
  },
  facts: [
    { value: "1.5%", label: "Monthly holding return", detail: "Calculated on the participation amount" },
    { value: "24", label: "Maximum holding months", detail: "A clearly defined participation term" },
    { value: "2", label: "Potential return components", detail: "Holding return and separate sale profit" },
  ],
  model: {
    kicker: "Why auction property",
    title: "Acquired for value. Improved for greater potential.",
    intro: "The opportunity begins before the auction. Each property is considered for its entry value, condition, location, improvement needs and realistic path to sale.",
    steps: [
      { title: "Select", body: "Identify residential auction properties with a credible value proposition and buyer demand." },
      { title: "Assess", body: "Review the property, location, indicative market value, legal position, costs and project timeline." },
      { title: "Improve", body: "Carry out the repairs or improvements needed to make the property more attractive to the market." },
      { title: "Sell", body: "Position the completed property for sale and distribute the applicable project outcome." },
    ],
  },
  risk: {
    kicker: "A more controlled approach",
    title: "Property-backed, selected carefully and managed with a plan.",
    body: "Property projects are not risk-free. K Asset Ventures is structured to manage those risks through disciplined selection, a physical underlying asset and more than one route to exit.",
    points: [
      { title: "A real underlying asset", body: "Each opportunity is connected to a residential property rather than an abstract product." },
      { title: "Potential value at entry", body: "Auction acquisition can create room between the purchase cost and indicative market value when a property is selected well." },
      { title: "Value through improvement", body: "Repairs and thoughtful improvements are used to strengthen the property’s market appeal and sale potential." },
      { title: "Alternative holding strategy", body: "If a suitable sale takes longer, the asset can be held and managed, including rental where appropriate." },
    ],
    disclosureTitle: "Managed risk, not zero risk",
    disclosure: "Property values, legal timelines, repair costs and buyer demand can change. Every participant should review the specific opportunity and Participant Agreement before joining.",
  },
  returns: {
    kicker: "How returns work",
    title: "Earn during the holding period—and from the project outcome.",
    body: "The holding return and sale-profit distribution are two separate components. This makes it easier to understand where each part of a participant’s potential return comes from.",
    holdingLabel: "During the holding period",
    holdingValue: "1.5%",
    holdingTitle: "Monthly holding return",
    holdingBody: "A 1.5% holding return is calculated each month on the participation amount, beginning when the campaign closes and continuing until the month the property is sold, up to 24 months.",
    profitLabel: "When the property is sold",
    profitValue: "+",
    profitTitle: "Separate sale-profit distribution",
    profitBody: "When the property is successfully sold, any applicable profit from the sale is calculated and distributed separately according to the project terms.",
    terms: "Calculation and payment treatment are governed by the specific opportunity terms and Participant Agreement.",
  },
  protection: {
    label: "Defined principal protection term",
    value: "24",
    unit: "months",
    title: "Your original principal is protected within a defined term.",
    body: "If the property remains unsold 24 months after the campaign closes, the participant’s original principal will be repaid in accordance with the Participant Agreement.",
    note: "Principal protection is separate from the holding return and sale-profit distribution. The applicable terms must be reviewed before participation.",
  },
  opportunities: {
    kicker: "Property opportunities",
    title: "A growing selection of homes to consider.",
    body: "New opportunities are introduced as suitable residential properties complete the assessment process. Approved members can compare the property, project plan, holding period and participation terms in one place.",
    types: [
      { title: "Terrace and landed homes", body: "Residential properties with broad owner-occupier appeal and clear improvement potential." },
      { title: "Apartments and urban residences", body: "Selected homes in locations where practical access and buyer demand support the exit plan." },
      { title: "Established and growth locations", body: "Opportunities considered in the context of the neighbourhood, comparable values and likely marketability." },
    ],
    detail: "Every live listing includes its own property information, campaign status, holding return, maximum term, documents and key risks.",
    cta: "View member opportunities",
  },
  journey: {
    kicker: "How to participate",
    title: "A clear path from selection to distribution.",
    steps: [
      { title: "Explore", body: "Browse selected opportunities in the member portal." },
      { title: "Review", body: "Read the project information, terms, documents and risks." },
      { title: "Participate", body: "Choose an amount and complete the required confirmation." },
      { title: "Track", body: "Follow the project and holding period through the portal." },
      { title: "Receive", body: "Review confirmed holding-return and sale-profit distributions." },
    ],
  },
  faq: {
    kicker: "Frequently asked questions",
    title: "What members usually want to know.",
    items: [
      { question: "What is an auction property opportunity?", answer: "It is an opportunity to participate in a selected residential property project acquired through the auction market, managed through improvement and holding, and intended for a later sale." },
      { question: "How are properties selected?", answer: "Each opportunity is assessed based on factors such as location, property condition, indicative market value, auction terms, estimated project costs and the intended exit strategy." },
      { question: "How does the 1.5% monthly holding return work?", answer: "The holding return is calculated monthly on the participant’s amount from the campaign close until the month the property is sold, subject to the 24-month maximum and the applicable project terms." },
      { question: "Is the holding return separate from the sale profit?", answer: "Yes. The 1.5% monthly holding return and any applicable profit distribution from the eventual property sale are calculated as separate components." },
      { question: "What happens if the property is sold early?", answer: "The holding period ends in the month of sale. The applicable holding return and sale-profit outcome are then handled according to that opportunity’s terms." },
      { question: "What happens if the property remains unsold after 24 months?", answer: "The participant’s original principal will be repaid in accordance with the Participant Agreement. This is the defined maximum holding term for the opportunity." },
      { question: "Who can participate?", answer: "Initial access is intended for registered and approved members. Account verification and acceptance of the applicable project documents are required before participation." },
    ],
  },
  finalCta: {
    kicker: "Your next property opportunity",
    title: "See what is available inside K Asset Ventures.",
    body: "Review selected auction property projects through a clear, structured member experience.",
    primary: "Request access",
    secondary: "Member login",
  },
  footer: {
    description: "K Asset Ventures by PICM Sdn Bhd",
    disclosure: "Information on this public page is general. Returns, sale profits and principal protection are subject to the specific opportunity and Participant Agreement. Property projects carry risks and timelines may change.",
    rights: "All rights reserved.",
    admin: "Admin access",
  },
};

const ms: LandingCopy = {
  locale: "ms",
  navigationLabel: "Navigasi awam",
  nav: [
    { label: "Mengapa hartanah lelong", href: "#model" },
    { label: "Pulangan", href: "#returns" },
    { label: "Perlindungan", href: "#protection" },
    { label: "Peluang", href: "#opportunities" },
    { label: "Soalan lazim", href: "#faq" },
  ],
  login: "Log masuk ahli",
  requestAccess: "Mohon akses",
  languageLabel: "Bahasa",
  hero: {
    kicker: "Akses persendirian kepada projek kediaman terpilih",
    title: "Jana pendapatan melalui peluang hartanah lelong terpilih.",
    body: "Sertai projek hartanah kediaman yang dipilih dengan teliti dan nikmati pulangan pegangan bulanan sementara setiap aset disiapkan dan diposisikan untuk jualan.",
    primary: "Terokai peluang",
    secondary: "Log masuk ahli",
    note: "Maklumat penuh peluang tersedia kepada ahli yang berdaftar dan diluluskan.",
    imageAlt: "Gambaran ilustrasi kediaman di Malaysia",
    imageCaption: "Hartanah kediaman terpilih · Diurus dari pemerolehan hingga jualan",
  },
  facts: [
    { value: "1.5%", label: "Pulangan pegangan bulanan", detail: "Dikira atas jumlah penyertaan" },
    { value: "24", label: "Bulan pegangan maksimum", detail: "Tempoh penyertaan yang ditetapkan" },
    { value: "2", label: "Komponen pulangan berpotensi", detail: "Pulangan pegangan dan untung jualan berasingan" },
  ],
  model: {
    kicker: "Mengapa hartanah lelong",
    title: "Diperoleh pada nilai berpotensi. Ditambah baik untuk peluang lebih besar.",
    intro: "Peluang bermula sebelum proses lelong. Setiap hartanah dipertimbangkan berdasarkan nilai pemerolehan, keadaan, lokasi, keperluan penambahbaikan dan laluan jualan yang realistik.",
    steps: [
      { title: "Pilih", body: "Kenal pasti hartanah kediaman lelong dengan potensi nilai dan permintaan pembeli yang munasabah." },
      { title: "Nilai", body: "Semak hartanah, lokasi, anggaran nilai pasaran, kedudukan undang-undang, kos dan tempoh projek." },
      { title: "Tambah baik", body: "Laksanakan pembaikan atau penambahbaikan yang diperlukan untuk meningkatkan tarikan pasaran hartanah." },
      { title: "Jual", body: "Pasarkan hartanah yang telah siap dan agihkan hasil projek yang berkenaan." },
    ],
  },
  risk: {
    kicker: "Pendekatan yang lebih terkawal",
    title: "Disokong hartanah, dipilih dengan teliti dan diurus dengan pelan.",
    body: "Projek hartanah bukan tanpa risiko. K Asset Ventures distruktur untuk mengurus risiko melalui pemilihan berdisiplin, aset fizikal sebenar dan lebih daripada satu pilihan untuk keluar daripada projek.",
    points: [
      { title: "Aset asas yang nyata", body: "Setiap peluang berkait dengan hartanah kediaman sebenar, bukan produk yang bersifat abstrak." },
      { title: "Potensi nilai ketika pemerolehan", body: "Pembelian lelong boleh mewujudkan ruang antara kos pemerolehan dan anggaran nilai pasaran apabila hartanah dipilih dengan baik." },
      { title: "Nilai melalui penambahbaikan", body: "Pembaikan dan penambahbaikan terancang digunakan untuk mengukuhkan tarikan pasaran serta potensi jualan hartanah." },
      { title: "Strategi pegangan alternatif", body: "Jika jualan yang sesuai mengambil masa, aset boleh terus dipegang dan diurus, termasuk disewakan apabila bersesuaian." },
    ],
    disclosureTitle: "Risiko diurus, bukan dihapuskan",
    disclosure: "Nilai hartanah, tempoh undang-undang, kos pembaikan dan permintaan pembeli boleh berubah. Setiap peserta perlu meneliti peluang khusus serta Perjanjian Peserta sebelum menyertai.",
  },
  returns: {
    kicker: "Bagaimana pulangan dijana",
    title: "Terima pulangan sepanjang tempoh pegangan—dan daripada hasil projek.",
    body: "Pulangan pegangan dan agihan keuntungan jualan ialah dua komponen berasingan. Ini memudahkan peserta memahami dari mana datangnya setiap bahagian pulangan berpotensi mereka.",
    holdingLabel: "Sepanjang tempoh pegangan",
    holdingValue: "1.5%",
    holdingTitle: "Pulangan pegangan bulanan",
    holdingBody: "Pulangan pegangan sebanyak 1.5% dikira setiap bulan atas jumlah penyertaan, bermula apabila kempen ditutup sehingga bulan hartanah terjual, tertakluk kepada maksimum 24 bulan.",
    profitLabel: "Apabila hartanah terjual",
    profitValue: "+",
    profitTitle: "Agihan keuntungan jualan berasingan",
    profitBody: "Apabila hartanah berjaya dijual, sebarang keuntungan jualan yang berkenaan dikira dan diagihkan secara berasingan mengikut terma projek.",
    terms: "Kaedah pengiraan dan pembayaran ditentukan oleh terma peluang khusus serta Perjanjian Peserta.",
  },
  protection: {
    label: "Tempoh perlindungan modal yang ditetapkan",
    value: "24",
    unit: "bulan",
    title: "Modal pokok anda dilindungi dalam tempoh yang jelas.",
    body: "Jika hartanah masih belum terjual selepas 24 bulan daripada tarikh kempen ditutup, modal pokok asal peserta akan dipulangkan mengikut Perjanjian Peserta.",
    note: "Perlindungan modal pokok adalah berasingan daripada pulangan pegangan dan agihan keuntungan jualan. Terma berkaitan perlu diteliti sebelum penyertaan.",
  },
  opportunities: {
    kicker: "Peluang hartanah",
    title: "Lebih banyak pilihan kediaman untuk dipertimbangkan.",
    body: "Peluang baharu diperkenalkan apabila hartanah kediaman yang bersesuaian selesai melalui proses penilaian. Ahli yang diluluskan boleh membandingkan hartanah, pelan projek, tempoh pegangan dan terma penyertaan di satu tempat.",
    types: [
      { title: "Rumah teres dan kediaman bertanah", body: "Hartanah kediaman dengan tarikan luas kepada pembeli serta potensi penambahbaikan yang jelas." },
      { title: "Apartmen dan kediaman bandar", body: "Kediaman terpilih di lokasi yang mempunyai akses praktikal dan permintaan pembeli bagi menyokong pelan jualan." },
      { title: "Lokasi matang dan sedang berkembang", body: "Peluang dinilai berdasarkan kejiranan, perbandingan nilai dan kebolehpasaran hartanah tersebut." },
    ],
    detail: "Setiap penyenaraian aktif memaparkan maklumat hartanah, status kempen, pulangan pegangan, tempoh maksimum, dokumen dan risiko utamanya.",
    cta: "Lihat peluang untuk ahli",
  },
  journey: {
    kicker: "Cara menyertai",
    title: "Laluan yang jelas daripada pemilihan hingga agihan.",
    steps: [
      { title: "Terokai", body: "Lihat peluang terpilih dalam portal ahli." },
      { title: "Teliti", body: "Baca maklumat projek, terma, dokumen dan risiko." },
      { title: "Sertai", body: "Pilih jumlah dan lengkapkan pengesahan yang diperlukan." },
      { title: "Pantau", body: "Ikuti projek dan tempoh pegangan melalui portal." },
      { title: "Terima", body: "Semak agihan pulangan pegangan dan keuntungan jualan yang disahkan." },
    ],
  },
  faq: {
    kicker: "Soalan lazim",
    title: "Perkara yang sering ingin diketahui oleh ahli.",
    items: [
      { question: "Apakah peluang hartanah lelong?", answer: "Ia ialah peluang untuk menyertai projek hartanah kediaman terpilih yang diperoleh melalui pasaran lelong, diurus melalui penambahbaikan dan pegangan, serta disasarkan untuk jualan kemudian." },
      { question: "Bagaimanakah hartanah dipilih?", answer: "Setiap peluang dinilai berdasarkan faktor seperti lokasi, keadaan hartanah, anggaran nilai pasaran, terma lelong, anggaran kos projek dan strategi jualan yang dirancang." },
      { question: "Bagaimanakah pulangan pegangan 1.5% sebulan dikira?", answer: "Pulangan pegangan dikira setiap bulan atas jumlah penyertaan bermula daripada tarikh kempen ditutup sehingga bulan hartanah terjual, tertakluk kepada maksimum 24 bulan dan terma projek berkenaan." },
      { question: "Adakah pulangan pegangan berasingan daripada untung jualan?", answer: "Ya. Pulangan pegangan bulanan 1.5% dan sebarang agihan keuntungan daripada jualan hartanah dikira sebagai dua komponen yang berasingan." },
      { question: "Apa berlaku jika hartanah terjual lebih awal?", answer: "Tempoh pegangan tamat pada bulan jualan. Pulangan pegangan yang berkenaan dan hasil keuntungan jualan kemudiannya diurus mengikut terma peluang tersebut." },
      { question: "Apa berlaku jika hartanah belum terjual selepas 24 bulan?", answer: "Modal pokok asal peserta akan dipulangkan mengikut Perjanjian Peserta. Ini ialah tempoh pegangan maksimum yang ditetapkan untuk peluang tersebut." },
      { question: "Siapa yang boleh menyertai?", answer: "Akses awal disediakan kepada ahli yang berdaftar dan diluluskan. Pengesahan akaun serta penerimaan dokumen projek berkaitan diperlukan sebelum penyertaan." },
    ],
  },
  finalCta: {
    kicker: "Peluang hartanah anda seterusnya",
    title: "Lihat peluang yang tersedia dalam K Asset Ventures.",
    body: "Terokai projek hartanah lelong terpilih melalui pengalaman ahli yang jelas dan tersusun.",
    primary: "Mohon akses",
    secondary: "Log masuk ahli",
  },
  footer: {
    description: "K Asset Ventures by PICM Sdn Bhd",
    disclosure: "Maklumat pada halaman awam ini adalah bersifat umum. Pulangan, keuntungan jualan dan perlindungan modal tertakluk kepada peluang khusus serta Perjanjian Peserta. Projek hartanah mempunyai risiko dan tempohnya boleh berubah.",
    rights: "Hak cipta terpelihara.",
    admin: "Akses pentadbir",
  },
};

export const landingCopy = { en, ms } as const;
