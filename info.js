const infoTitle = document.getElementById('infoTitle');
const infoText = document.getElementById('infoText');
const infoList = document.getElementById('infoList');
const infoSections = document.getElementById('infoSections');
const infoFaq = document.getElementById('infoFaq');

const dataSource = window.footerContentData || { byTab: {}, byDetail: {} };
const params = new URLSearchParams(window.location.search);

const detailKey = params.get('detail');
const tabKey = params.get('tab');

let content = null;

if (detailKey && dataSource.byDetail[detailKey]) {
  content = dataSource.byDetail[detailKey];
} else if (tabKey && dataSource.byTab[tabKey]) {
  content = dataSource.byTab[tabKey];
} else {
  content = {
    title: 'Information Not Found',
    text: 'This section does not exist yet. Please return to the homepage and choose another item.',
    points: ['Open another menu item', 'Check query parameters', 'Refresh after updates'],
  };
}

function buildLongSections(entry) {
  const keyPoints = (entry.points || []).join(', ');
  const audienceLine = entry.tab
    ? `This section belongs to the ${entry.tab} track and is intended for members who want structured progress with measurable outcomes.`
    : 'This section is designed for members who want to improve decision quality and execution consistency.';

  return [
    {
      heading: 'Detailed Overview',
      body:
        `${entry.text} In practical terms, this module is not just an introduction; it gives members a framework for planning, execution, and review. ` +
        `Instead of consuming random lessons, members follow a sequence that connects theory to live decision-making and post-trade reflection.`,
    },
    {
      heading: 'Who This Is For',
      body:
        `${audienceLine} It is especially useful for traders who feel inconsistent, overtrade during volatility, or lack a repeatable checklist before entering positions. ` +
        `By clarifying expectations and process, this section helps reduce emotional decisions and improve confidence over time.`,
    },
    {
      heading: 'What You Get',
      body:
        `Members receive concrete deliverables such as templates, workflows, and guided review prompts. Core focus areas include: ${keyPoints}. ` +
        `Each element is designed to be actionable so members can apply it directly in their weekly trading routine.`,
    },
    {
      heading: 'Expected Outcomes',
      body:
        `After consistent participation, members typically report better trade selection, stronger risk control, and improved journaling discipline. ` +
        `The main goal is long-term consistency, not short-term excitement, so progress is measured through process quality and risk-adjusted performance.`,
    },
  ];
}

function buildFaq(entry) {
  return [
    {
      q: 'How long should I spend on this section each week?',
      a: 'Most members allocate 3-5 focused hours per week, including lesson review, checklist practice, and one structured reflection session.',
    },
    {
      q: 'Do I need prior experience before using this?',
      a: `No. ${entry.title} is designed with a guided structure, so beginners can start safely while advanced members can still use it to tighten execution discipline.`,
    },
    {
      q: 'How do I track real progress?',
      a: 'Track progress through pre-trade checklist adherence, position-sizing consistency, journal quality, and monthly review metrics rather than isolated wins or losses.',
    },
  ];
}

if (infoTitle) {
  infoTitle.textContent = content.title;
}

if (infoText) {
  infoText.textContent = content.text;
}

if (infoList) {
  infoList.innerHTML = '';
  (content.points || []).forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    infoList.appendChild(li);
  });
}

if (infoSections) {
  infoSections.innerHTML = '';
  const sections = content.sections || buildLongSections(content);
  sections.forEach((section) => {
    const article = document.createElement('article');
    article.className = 'info-section';

    const heading = document.createElement('h2');
    heading.textContent = section.heading;

    const paragraph = document.createElement('p');
    paragraph.textContent = section.body;

    article.appendChild(heading);
    article.appendChild(paragraph);
    infoSections.appendChild(article);
  });
}

if (infoFaq) {
  infoFaq.innerHTML = '';
  const faqItems = content.faq || buildFaq(content);
  faqItems.forEach((item) => {
    const wrap = document.createElement('article');
    wrap.className = 'info-faq-item';

    const q = document.createElement('h3');
    q.textContent = item.q;

    const a = document.createElement('p');
    a.textContent = item.a;

    wrap.appendChild(q);
    wrap.appendChild(a);
    infoFaq.appendChild(wrap);
  });
}
