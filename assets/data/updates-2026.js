/*
HOW TO ADD A WEEKLY OR MONTHLY UPDATE
-------------------------------------
1. Copy one complete object from { to }.
2. Paste it immediately after the opening [ so the newest item remains first.
3. Change the id, date, type, title, summary and optional link.
4. Keep the comma after each object except the final object.

VALID type VALUES
opportunity | blog | publication

For a job or deadline, use expires: "YYYY-MM-DD". Leave it empty for other entries.
*/
window.UPDATE_POSTS = window.UPDATE_POSTS || {};
window.UPDATE_POSTS["2026"] = [
  {
  "id": "research-associate-opportunity",
  "date": "2026-07-31",
  "type": "opportunity",
  "title": "Research associate opportunity Dept. of BSBE, IIT Roorkee",
  "summary": "Check link for more info",
  "url": "https://iitr.ac.in/Careers/static/Project_Jobs/BSBE/2026/adv310720263.pdf",
  "linkLabel": "View opportunity",
  "expires": "2026-08-19"
},
  {
    "id": "2026-07-30-gpu-research-environment",
    "date": "2026-07-30",
    "type": "blog",
    "title": "Building a reproducible GPU-enabled computational research environment",
    "summary": "I am configuring and validating a research environment for molecular dynamics, enhanced sampling, free-energy calculations, cheminformatics, machine learning, and reproducible computational workflows.",
    "url": "",
    "linkLabel": "",
    "expires": ""
  },
  {
    "id": "2026-07-28-machine-learning-roadmap",
    "date": "2026-07-28",
    "type": "blog",
    "title": "A machine-learning roadmap for cheminformatics and molecular discovery",
    "summary": "The planned workflow covers classical QSAR, deep learning, graph neural networks, model explainability, hyperparameter optimisation, uncertainty assessment, and experiment tracking.",
    "url": "",
    "linkLabel": "",
    "expires": ""
  },
  {
    "id": "2026-07-20-ai-cancer-book-chapter",
    "date": "2026-07-20",
    "type": "publication",
    "title": "Publication alert: AI in designing novel cancer treatments",
    "summary": "This book chapter discusses the use of artificial intelligence in the design and development of emerging cancer-treatment strategies.",
    "url": "https://www.sciencedirect.com/science/chapter/edited-volume/abs/pii/B9780443450044000116",
    "linkLabel": "View publication",
    "expires": ""
  }
];
