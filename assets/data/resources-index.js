/*
The resource directory contains six scientific/technical sections plus Others.
Each section is stored in its own small file, so long-term editing remains manageable.
*/
window.RESOURCE_CATEGORIES = [
  { "id": "all", "label": "All sections", "files": [] },
  { "id": "molecular-simulation", "label": "Molecular simulation", "files": ["assets/data/resources-molecular-simulation.js"] },
  { "id": "computational-chemistry", "label": "Computational chemistry", "files": ["assets/data/resources-computational-chemistry.js"] },
  { "id": "cheminformatics", "label": "Cheminformatics & QSAR", "files": ["assets/data/resources-cheminformatics.js"] },
  { "id": "bioinformatics", "label": "Bioinformatics & multi-omics", "files": ["assets/data/resources-bioinformatics.js"] },
  { "id": "machine-learning", "label": "Machine learning & AI", "files": ["assets/data/resources-machine-learning.js"] },
  { "id": "research-software", "label": "Research software & reproducibility", "files": ["assets/data/resources-research-software.js"] },
  { "id": "others", "label": "Others", "files": ["assets/data/resources-others.js"] }
];

/* These common tags appear as quick filters. Detailed tags remain keyword-searchable. */
window.RESOURCE_QUICK_TAGS = ["all", "software", "tutorial", "dataset", "code", "documentation"];
