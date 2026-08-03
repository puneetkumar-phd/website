/* Add tools in the order you want them numbered. Numbering is automatic. */

window.RESOURCE_LIBRARY = window.RESOURCE_LIBRARY || {};

window.RESOURCE_LIBRARY["molecular-simulation"] =
  (window.RESOURCE_LIBRARY["molecular-simulation"] || []).concat([
    {
      "name": "PLUMED",
      "description": "An open-source library used with molecular-dynamics engines for collective variables, enhanced sampling, free-energy methods, and trajectory analysis.",
      "website": "https://www.plumed.org/",
      "tutorial": "https://www.plumed-tutorials.org/",
      "code": "",
      "dataset": "",
      "documentation": "https://www.plumed.org/doc",
      "tags": [
        "software",
        "tutorial",
        "enhanced sampling",
        "metadynamics",
        "free energy"
      ]
    },

    {
      "name": "GROMACS",
      "description": "A molecular-dynamics software suite for biomolecular simulation, system preparation, trajectory production, and analysis, with support for accelerated computing.",
      "website": "https://www.gromacs.org/",
      "tutorial": "https://tutorials.gromacs.org/index.html",
      "code": "",
      "dataset": "",
      "documentation": "https://manual.gromacs.org/current/index.html",
      "tags": [
        "software",
        "molecular dynamics",
        "tutorial",
        "GPU",
        "trajectory analysis",
        "documentation"
      ]
    },

    {
      "name": "AMBER",
      "description": "AmberTools consists of several independently developed packages that work well by themselves and with Amber26. The suite can also be used to carry out complete molecular dynamics simulations using either explicit-water or generalized Born solvent models.",
      "website": "https://ambermd.org/",
      "tutorial": "https://amberhub.chpc.utah.edu/tutorials/",
      "code": "",
      "dataset": "",
      "documentation": "https://ambermd.org/Manuals.php",
      "tags": [
        "software",
        "molecular dynamics",
        "tutorial",
        "GPU",
        "trajectory analysis",
        "documentation"
      ]
    },

    {
      "name": "NAMD",
      "description": "NAMD is a parallel molecular dynamics code designed for high-performance simulation of large biomolecular systems.",
      "website": "https://www.ks.uiuc.edu/Research/namd/",
      "tutorial": "https://www.ks.uiuc.edu/Training/Tutorials/namd-index.html",
      "code": "",
      "dataset": "",
      "documentation": "https://www.ks.uiuc.edu/Research/namd/",
      "tags": [
        "software",
        "molecular dynamics",
        "tutorial",
        "GPU",
        "high-performance computing",
        "trajectory analysis",
        "documentation"
      ]
    }
  ]);
