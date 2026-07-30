/*
HOW TO ADD A WEEKLY OR MONTHLY ENTRY
-----------------------------------
1. Copy one complete object between { and }.
2. Paste the copy immediately after the opening [ below.
3. Change every field. Keep commas and quotation marks.
4. Use a unique id beginning with the date, for example: 2026-08-05-rdkit-descriptors
5. Set featured: true only for a small number of current notices.
6. For a vacancy or deadline, add expires: "YYYY-MM-DD" so it disappears from Latest news after that date.
7. Entries remain searchable in the archive even after they are no longer featured.

VALID VALUES
category: molecular-simulation | computational-chemistry | cheminformatics | bioinformatics | machine-learning | research-software | alerts
type: tutorial | software | research | publication | dataset | opportunity | resource
*/
window.UPDATE_LIBRARY = window.UPDATE_LIBRARY || {};
window.UPDATE_LIBRARY["2026"] = [
  {
    "id": "2026-07-30-gpu-simulation-environment",
    "date": "2026-07-30",
    "type": "research",
    "category": "research-software",
    "title": "GPU molecular-simulation environment: configuration and validation in progress",
    "summary": "I am building a reproducible GPU-enabled research environment for molecular dynamics, enhanced sampling, free-energy calculations, cheminformatics, and machine-learning workflows. Installation records, validation tests, and reusable tutorials will be added as they are completed.",
    "url": "",
    "linkLabel": "",
    "tags": [
      "GROMACS",
      "PLUMED",
      "CUDA",
      "Reproducibility"
    ],
    "featured": true,
    "status": "In progress",
    "expires": ""
  },
  {
    "id": "2026-07-29-gromacs-plumed",
    "date": "2026-07-29",
    "type": "software",
    "category": "molecular-simulation",
    "title": "Building a GPU-accelerated GROMACS and PLUMED research environment",
    "summary": "Configuration and validation work is focused on GPU-enabled molecular dynamics, enhanced sampling, metadynamics, umbrella sampling, trajectory analysis, and reproducible installation records.",
    "url": "",
    "linkLabel": "",
    "tags": [
      "GROMACS",
      "PLUMED",
      "CUDA",
      "Enhanced sampling"
    ],
    "featured": true,
    "status": "In progress",
    "expires": ""
  },
  {
    "id": "2026-07-28-ml-roadmap",
    "date": "2026-07-28",
    "type": "research",
    "category": "machine-learning",
    "title": "Machine-learning roadmap for cheminformatics and molecular discovery",
    "summary": "The planned stack covers classical QSAR, deep learning, graph neural networks, model explainability, hyperparameter optimisation, uncertainty assessment, and reproducible experiment tracking.",
    "url": "",
    "linkLabel": "",
    "tags": [
      "QSAR",
      "GNN",
      "Explainable AI",
      "ML workflows"
    ],
    "featured": true,
    "status": "Planned",
    "expires": ""
  },
  {
    "id": "2026-07-24-reproducible-notes",
    "date": "2026-07-24",
    "type": "tutorial",
    "category": "research-software",
    "title": "From installation to validation: reproducible computational research notes",
    "summary": "Future tutorials will record exact installation commands, environment files, version checks, benchmark tests, troubleshooting decisions, and validated workflows for reuse by other researchers.",
    "url": "",
    "linkLabel": "",
    "tags": [
      "Linux",
      "GitHub",
      "Environment management"
    ],
    "featured": false,
    "status": "Planned",
    "expires": ""
  },
  {
    "id": "2026-07-23-plumed",
    "date": "2026-07-23",
    "type": "software",
    "category": "molecular-simulation",
    "title": "PLUMED: enhanced sampling and free-energy methods",
    "summary": "PLUMED is a community-developed, open-source library for enhanced sampling, free-energy methods, collective variables, and molecular-dynamics trajectory analysis. It can be used with major simulation engines, including GROMACS and AMBER.",
    "url": "https://www.plumed.org/",
    "linkLabel": "Visit PLUMED",
    "tags": [
      "PLUMED",
      "Metadynamics",
      "Free energy"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  },
  {
    "id": "2026-07-22-gromacs-docs",
    "date": "2026-07-22",
    "type": "resource",
    "type": "tutorial",
    "category": "molecular-simulation",
    "title": "GROMACS documentation and tutorial ",
    "summary": "This is the home of the free online GROMACS tutorials. The tutorials are provided as interactive Jupyter notebooks. This is the same content regularly used in training workshops around GROMACS.",
    "url": "https://tutorials.gromacs.org/index.html",
    "linkLabel": "Open GROMACS tutorials",
    "tags": [
      "GROMACS",
      "Molecular dynamics",
      "Tutorials"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  },
  {
    "id": "2026-07-21-autodock-vina",
    "date": "2026-07-21",
    "type": "resource",
    "category": "computational-chemistry",
    "title": "AutoDock Vina documentation",
    "summary": "AutoDock Vina is an open-source molecular-docking engine. Its documentation covers installation, receptor and ligand preparation, search-space definition, scoring options, Python bindings, and practical docking examples.",
    "url": "https://autodock-vina.readthedocs.io/en/latest/",
    "linkLabel": "Open Vina documentation",
    "tags": [
      "Docking",
      "Virtual screening",
      "Python"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  },
  {
    "id": "2026-07-20-rdkit-docs",
    "date": "2026-07-20",
    "type": "resource",
    "category": "cheminformatics",
    "title": "RDKit documentation, cookbook, and Python API",
    "summary": "The RDKit documentation provides installation instructions, Python tutorials, molecular descriptors, fingerprints, substructure operations, chemical reactions, visualisation utilities, and API references for cheminformatics workflows.",
    "url": "https://www.rdkit.org/docs/index.html",
    "linkLabel": "Open RDKit documentation",
    "tags": [
      "RDKit",
      "Descriptors",
      "Fingerprints"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  },
  {
    "id": "2026-07-19-bioconductor",
    "date": "2026-07-19",
    "type": "resource",
    "category": "bioinformatics",
    "title": "Bioconductor software, workflows, and training resources",
    "summary": "Bioconductor is an open-source R ecosystem for reproducible analysis of biological data. It provides packages, vignettes, books, workflows, and training materials for genomics, transcriptomics, annotation, and related bioinformatics tasks.",
    "url": "https://www.bioconductor.org/",
    "linkLabel": "Visit Bioconductor",
    "tags": [
      "R",
      "Transcriptomics",
      "Bioconductor"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  },
  {
    "id": "2026-07-18-scikit-learn",
    "date": "2026-07-18",
    "type": "resource",
    "category": "machine-learning",
    "title": "scikit-learn user guide",
    "summary": "The scikit-learn user guide covers supervised and unsupervised learning, preprocessing, pipelines, cross-validation, model selection, evaluation metrics, feature selection, and practical machine-learning implementation in Python.",
    "url": "https://scikit-learn.org/stable/user_guide.html",
    "linkLabel": "Open user guide",
    "tags": [
      "Machine learning",
      "Python",
      "Validation"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  },
  {
    "id": "2026-07-17-mamba",
    "date": "2026-07-17",
    "type": "resource",
    "category": "research-software",
    "title": "Mamba and Micromamba documentation",
    "summary": "Mamba is a fast package and environment manager compatible with Conda packages. Its documentation covers installation, environment creation, dependency management, configuration, and reproducible command-line workflows.",
    "url": "https://mamba.readthedocs.io/en/stable/",
    "linkLabel": "Open Mamba documentation",
    "tags": [
      "Mamba",
      "Conda",
      "Environments"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  },
  {
    "id": "2026-07-16-google-scholar",
    "date": "2026-07-16",
    "type": "publication",
    "category": "alerts",
    "title": "Google Scholar publication profile",
    "summary": "The profile provides the current publication list, citation record, related articles, and author metrics. Individual publication alerts can be added as separate entries when new papers are published or accepted.",
    "url": "https://scholar.google.com/citations?hl=en&user=aHLch4UAAAAJ",
    "linkLabel": "Open Google Scholar",
    "tags": [
      "Publications",
      "Citations",
      "Research profile"
    ],
    "featured": false,
    "status": "Resource",
    "expires": ""
  }
];
