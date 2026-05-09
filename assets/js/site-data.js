// Centralized site content. Updating this object should be enough for most edits.
window.SITE_DATA = {
  meta: {
    title: "Hyunsu Go",
    role: "Student Researcher",
    subtitle: "",
    tagline:
      "Student researcher working on biomedical signal learning and medical imaging, with growing interest in 3D vision and embodied AI.",
    bio:
      "I work on biomedical signal learning for single-cell analysis and medical imaging for 3D MRI and clinical prediction. I am also studying 3D vision, generative modeling, human-object interaction, and embodied AI, with a broader interest in representation learning and efficient models.",
    profileImage: "assets/img/profile.png",
    focusAreas: [
      {
        mark: "🧬",
        text: "Biomedical signal learning for single-cell analysis"
      },
      {
        mark: "🏥",
        text: "Medical imaging for 3D MRI and clinical prediction"
      },
      {
        mark: "🧭",
        text: "Exploring 3D vision, generative modeling, and embodied AI"
      }
    ],
    location: "Seoul, South Korea"
  },

  navigation: [
    { label: "About", href: "#about" },
    { label: "Research", href: "#research" },
    { label: "Publications", href: "#publications" },
    { label: "Experience", href: "#experience" },
    { label: "Awards", href: "#awards" },
    { label: "Contact", href: "#contact" }
  ],

  heroLinks: [
    {
      label: "Email",
      value: "hsmail02@snu.ac.kr",
      display: "Email",
      mark: "✉️",
      url: "mailto:hsmail02@snu.ac.kr"
    },
    {
      label: "Google Scholar",
      value: "Scholar",
      display: "Google Scholar",
      mark: "📚",
      url: "https://scholar.google.com/citations?user=Gjaw-5oAAAAJ"
    },
    {
      label: "CV",
      value: "Updated soon",
      display: "CV",
      mark: "📄",
      url: null
    },
    {
      label: "GitHub",
      value: "github.com/gohyunsu",
      display: "GitHub",
      mark: "💻",
      url: "https://github.com/gohyunsu"
    },
    {
      label: "LinkedIn",
      value: "hyunsu-go-650546348",
      display: "LinkedIn",
      mark: "🔗",
      url: "https://www.linkedin.com/in/hyunsu-go-650546348/"
    }
  ],

  research: [
    {
      icon: "🔬",
      title: "Biomedical Signal Learning",
      description:
        "Representation learning and analysis for SMR-based single-cell signals."
    },
    {
      icon: "🏥",
      title: "Medical Imaging AI",
      description:
        "3D MRI analysis, perineural invasion prediction, self-supervised learning, and efficient models for medical imaging."
    },
    {
      icon: "🧭",
      title: "3D Vision & Embodied AI",
      description:
        "A newer direction of study spanning 3D vision, generative modeling, human-object interaction, and embodied AI."
    }
  ],

  publications: [
    {
      slug: "mma-former",
      title:
        "MMA-Former: Multi-Window Mixture-of-Head Attention Transformer for Adaptive PNI Prediction in 3D MRI",
      authors:
        "Youngung Han (Seoul National University, Korea (South) & OUTTA, Korea (South)); Induk Um (Chung-Ang University, Korea (South)); Kyeonghun Kim (OUTTA, Korea (South)); Junga Kim, Hyunsu Go, Jaewon Jung and Nam-Joon Kim (Seoul National University, Korea (South)); Woo Kyoung Jeong (Samsung Medical Center, Korea (South)); Won Jae Lee (Samsung Medical Center, Sungkyunkwan University School of Medicine, Korea (South)); Pa Hong (Samsung Changwon Hospital, Korea (South)); Ken Ying-Kai Liao (NVIDIA, Taiwan); Hyuk-Jae Lee (Seoul National University, Korea (South))",
      authorsShort:
        "Youngung Han, Induk Um, Kyeonghun Kim, Junga Kim, Hyunsu Go, Jaewon Jung, Nam-Joon Kim, et al.",
      venue: "ISBI 2026",
      status: "Oral Presentation",
      category: "Accepted",
      tags: ["Medical AI", "3D MRI", "Transformer", "PNI Prediction"],
      figure: "assets/img/papers/mma-former.png",
      summary:
        "Multi-window attention for adaptive prediction of perineural invasion from volumetric MRI.",
      links: [
        {
          label: "ISBI Program",
          url: "https://confcats-event-sessions.s3.us-east-1.amazonaws.com/isbi26/uploads/ISBI_2026_Program_v11b.pdf"
        }
      ],
      note: "TS-017, Thu Apr. 9, 2026, 15:00 BST, Room 15."
    },
    {
      slug: "losa-net",
      title:
        "LoSA-Net: A Localized and Scale-Adaptive Network for Boundary-Sensitive Prediction of Perineural Invasion in 3D MRI",
      authors:
        "Youngung Han (Seoul National University, Korea (South) & OUTTA, Korea (South)); Hyunsu Go (Seoul National University, Korea (South)); Kyeonghun Kim (OUTTA, Korea (South)); Induk Um (Chung-Ang University, Korea (South)); Junga Kim, Jaewon Jung and Nam-Joon Kim (Seoul National University, Korea (South)); Woo Kyoung Jeong (Samsung Medical Center, Korea (South)); Won Jae Lee (Samsung Medical Center, Sungkyunkwan University School of Medicine, Korea (South)); Ken Ying-Kai Liao (NVIDIA, Taiwan); Pa Hong (Samsung Changwon Hospital, Korea (South)); Hyuk-Jae Lee (Seoul National University, Korea (South))",
      authorsShort:
        "Youngung Han, Hyunsu Go, Kyeonghun Kim, Induk Um, Junga Kim, Jaewon Jung, Nam-Joon Kim, et al.",
      venue: "ISBI 2026",
      status: "Oral Presentation",
      category: "Accepted",
      tags: ["Medical AI", "3D MRI", "Boundary Prediction", "PNI Prediction"],
      figure: "assets/img/papers/losa-net.png",
      summary:
        "A localized and scale-adaptive network for boundary-sensitive PNI prediction in 3D MRI.",
      links: [
        {
          label: "ISBI Program",
          url: "https://confcats-event-sessions.s3.us-east-1.amazonaws.com/isbi26/uploads/ISBI_2026_Program_v11b.pdf"
        }
      ],
      note: "TS-030, Fri Apr. 10, 2026, 10:30 BST, Room 3."
    },
    {
      slug: "maesil",
      title:
        "MAESIL: Masked Autoencoder for Enhanced Self-Supervised Medical Image Learning",
      authors:
        "Kyeonghun Kim, Hyeonseok Jung, Youngung Han, Junsu Lim, YeonJu Jean, Seongbin Park, Eunseob Choi, Hyunsu Go, et al.",
      authorsShort:
        "Kyeonghun Kim, Hyeonseok Jung, Youngung Han, Junsu Lim, YeonJu Jean, Seongbin Park, Eunseob Choi, Hyunsu Go, et al.",
      venue: "ICEIC 2026",
      status: "Accepted",
      category: "Accepted",
      tags: ["Self-Supervised Learning", "Medical Imaging", "3D CT", "Masked Autoencoder"],
      figure: "assets/img/papers/maesil.png",
      summary:
        "A masked autoencoder framework for learning 3D structural representations from medical volumes.",
      links: [
        { label: "arXiv", url: "https://arxiv.org/abs/2604.00514" },
        { label: "PDF", url: "https://arxiv.org/pdf/2604.00514" },
        { label: "ICEIC", url: "https://iceic.org/archives/?keyword=&pid=38" }
      ]
    },
    {
      slug: "mathena",
      title:
        "MATHENA: Mamba-based Architectural Tooth Hierarchical Estimator and Holistic Evaluation Network for Anatomy",
      authors:
        "Kyeonghun Kim, Jaehyung Park, Youngung Han, Anna Jung, Seongbin Park, Sumin Lee, Jiwon Yang, Jiyoon Han, Subeen Lee, Junsu Lim, Hyunsu Go, et al.",
      authorsShort:
        "Kyeonghun Kim, Jaehyung Park, Youngung Han, Anna Jung, Seongbin Park, Sumin Lee, Jiwon Yang, Jiyoon Han, Hyunsu Go, et al.",
      venue: "MICCAI 2026",
      status: "Under Review",
      category: "Under Review",
      tags: ["Dental AI", "Mamba", "Medical Imaging", "Anatomy"],
      figure: "assets/img/papers/mathena.png",
      summary:
        "A Mamba-based framework for unified dental anatomy understanding across multiple diagnostic tasks.",
      links: [
        { label: "arXiv", url: "https://arxiv.org/abs/2604.00537" },
        { label: "PDF", url: "https://arxiv.org/pdf/2604.00537" }
      ],
      note: "MICCAI 2026 rebuttal in progress."
    },
    {
      slug: "anatomy-privileged-distillation",
      title:
        "Anatomy-Privileged Distillation with Token Routing for MRI-Based Prediction of Perineural Invasion",
      authors:
        "Hyunsu Go (Seoul National University, Korea (South)); Youngung Han (Seoul National University, Korea (South) & OUTTA, Korea (South)); Kyeonghun Kim (OUTTA, Korea (South)); Junga Kim (Seoul National University, Korea (South)); Dohyun Kweon (Kyung Hee University, Korea (South)); Jinyong Jun (Seoul National University, Korea (South)); Sungha Park (Seoul National University School of Medicine, Korea (South) & Seoul National University, Korea (South)); Anna Jung (Seoul National University, Korea (South)); Induk Um (Chung-Ang University, Korea (South)); Yului Jeong, Suah Park and Jina Jeong (Seoul National University, Korea (South)); Pa Hong (Samsung Changwon Hospital, Korea (South)); Woo Kyoung Jeong (Samsung Medical Center, Korea (South)); Won Jae Lee (Samsung Medical Center, Sungkyunkwan University School of Medicine, Korea (South)); Ken Ying-Kai Liao (NVIDIA, Taiwan); Hyuk-Jae Lee and Nam-Joon Kim (Seoul National University, Korea (South))",
      authorsShort:
        "Hyunsu Go, Youngung Han, Kyeonghun Kim, Junga Kim, Dohyun Kweon, Jinyong Jun, Sungha Park, et al.",
      venue: "AICAS 2026",
      status: "Under Review",
      category: "Under Review",
      tags: ["Medical AI", "Distillation", "Token Routing", "3D MRI"],
      figure: null,
      summary:
        "Anatomy-guided distillation and routing for efficient MRI-based PNI prediction.",
      links: [
        {
          label: "AICAS 2026",
          url: "https://ieee-cas.org/event/conference/2026-ieee-8th-international-conference-artificial-intelligence-circuits-and"
        }
      ]
    },
    {
      slug: "spikeds",
      title:
        "SpikeDS: Dual Sparsity Spikformer for Perineural Invasion Prediction in 3D MRI",
      authors:
        "Induk Um (Chung-Ang University, Korea (South)); Youngung Han (Seoul National University, Korea (South) & OUTTA, Korea (South)); Kyeonghun Kim (OUTTA, Korea (South)); Yului Jeong, Jina Jeong and Hyunsu Go (Seoul National University, Korea (South)); Dohyun Kweon (Kyung Hee University, Korea (South)); Sungha Park (Seoul National University School of Medicine, Korea (South) & Seoul National University, Korea (South)); Junga Kim, Anna Jung, Suah Park and Hyuk-Jae Lee (Seoul National University, Korea (South)); Pa Hong (Samsung Changwon Hospital, Korea (South)); Woo Kyoung Jeong (Samsung Medical Center, Korea (South)); Won Jae Lee (Samsung Medical Center, Sungkyunkwan University School of Medicine, Korea (South)); Ken Ying-Kai Liao (NVIDIA, Taiwan); Nam-Joon Kim (Seoul National University, Korea (South))",
      authorsShort:
        "Induk Um, Youngung Han, Kyeonghun Kim, Yului Jeong, Jina Jeong, Hyunsu Go, Dohyun Kweon, et al.",
      venue: "AICAS 2026",
      status: "Under Review",
      category: "Under Review",
      tags: ["Spiking Neural Networks", "Sparsity", "Transformer", "3D MRI"],
      figure: null,
      summary:
        "A sparse spiking-transformer approach for efficient volumetric MRI prediction.",
      links: [
        {
          label: "AICAS 2026",
          url: "https://ieee-cas.org/event/conference/2026-ieee-8th-international-conference-artificial-intelligence-circuits-and"
        }
      ]
    },
    {
      slug: "adaptive-routing",
      title:
        "Adaptive Routing for Efficient Diffusion Transformer-Based PNI Prediction",
      authors:
        "Youngung Han (Seoul National University, Korea (South) & OUTTA, Korea (South)); Dohyun Kweon (Kyung Hee University, Korea (South)); Kyeonghun Kim (OUTTA, Korea (South)); Hyunsu Go, Jina Jeong and Suah Park (Seoul National University, Korea (South)); Induk Um (Chung-Ang University, Korea (South)); Junga Kim, Anna Jung and Yului Jeong (Seoul National University, Korea (South)); Sungha Park (Seoul National University School of Medicine, Korea (South) & Seoul National University, Korea (South)); Pa Hong (Samsung Changwon Hospital, Korea (South)); Woo Kyoung Jeong (Samsung Medical Center, Korea (South)); Won Jae Lee (Samsung Medical Center, Sungkyunkwan University School of Medicine, Korea (South)); Ken Ying-Kai Liao (NVIDIA, Taiwan); Hyuk-Jae Lee and Nam-Joon Kim (Seoul National University, Korea (South))",
      authorsShort:
        "Youngung Han, Dohyun Kweon, Kyeonghun Kim, Hyunsu Go, Jina Jeong, Suah Park, Induk Um, et al.",
      venue: "AICAS 2026",
      status: "Under Review",
      category: "Under Review",
      tags: ["Diffusion Transformer", "Adaptive Routing", "Medical AI", "PNI"],
      figure: null,
      summary:
        "Adaptive routing for efficient diffusion-transformer-based prediction in 3D medical imaging.",
      links: [
        {
          label: "AICAS 2026",
          url: "https://ieee-cas.org/event/conference/2026-ieee-8th-international-conference-artificial-intelligence-circuits-and"
        }
      ]
    },
    {
      slug: "nemesis",
      title:
        "NEMESIS: Noise-Suppressed Efficient MAE with Enhanced Superpatch Integration Strategy",
      authors:
        "Kyeonghun Kim, Hyeonseok Jung, Youngung Han, Hyunsu Go, Eunseob Choi, Seongbin Park, Junsu Lim, Jiwon Yang, Sumin Lee, Insung Hwang, Ken Ying-Kai Liao, Nam-Joon Kim",
      authorsShort:
        "Kyeonghun Kim, Hyeonseok Jung, Youngung Han, Hyunsu Go, Eunseob Choi, Seongbin Park, Junsu Lim, et al.",
      venue: "AICAS 2026",
      status: "Under Review",
      category: "Under Review",
      tags: ["Self-Supervised Learning", "MAE", "Superpatch", "3D CT"],
      figure: null,
      summary:
        "A noise-suppressed efficient masked autoencoder using superpatch-based 3D medical representation learning.",
      links: [
        { label: "arXiv", url: "https://arxiv.org/abs/2604.01612" },
        { label: "PDF", url: "https://arxiv.org/pdf/2604.01612" },
        {
          label: "AICAS 2026",
          url: "https://ieee-cas.org/event/conference/2026-ieee-8th-international-conference-artificial-intelligence-circuits-and"
        }
      ]
    }
  ],

  news: [
    {
      icon: "🧾",
      date: "May 2026",
      text: "MATHENA entered the MICCAI 2026 rebuttal stage.",
      mentions: [{ label: "MATHENA", slug: "mathena" }]
    },
    {
      icon: "🎤",
      date: "Mar 2026",
      text: "LoSA-Net and MMA-Former were accepted as oral presentations at ISBI 2026.",
      mentions: [
        { label: "LoSA-Net", slug: "losa-net" },
        { label: "MMA-Former", slug: "mma-former" }
      ]
    },
    {
      icon: "✅",
      date: "Nov 2025",
      text: "MAESIL was accepted to ICEIC 2026.",
      mentions: [{ label: "MAESIL", slug: "maesil" }]
    }
  ],

  researchExperience: [
    {
      icon: "🔎",
      title: "Imaging-driven Medical SuperIntelligence Group",
      url: "https://snulabs.github.io/imsi/",
      institution:
        "Interdisciplinary Program in AI Semiconductor Engineering, Seoul National University",
      period: "Aug 2025-Apr 2026",
      advisor: {
        name: "Prof. Nam-Joon Kim",
        url: "https://snulabs.github.io/imsi/",
        email: "knj01@snu.ac.kr"
      },
      description:
        "3D MRI analysis, perineural invasion prediction, self-supervised learning, and efficient models for medical imaging."
    },
    {
      icon: "🧪",
      title: "Precision Bioinstrumentation Laboratory",
      url: "https://kanglab.snu.ac.kr/",
      institution: "Dept. of Mechanical Engineering, Seoul National University",
      period: "Jul 2024-Present",
      advisor: {
        name: "Prof. Joon Ho Kang",
        url: "https://kanglab.snu.ac.kr/",
        email: "joonhokang@snu.ac.kr"
      },
      description:
        "SMR-based single-cell analysis, with emphasis on representation learning, cross-experiment correction, and interpretability."
    },
    {
      icon: "⚡",
      title: "CLean Energy & Nanoheat Laboratory",
      url: "https://www.hydrogen.snu.ac.kr/",
      institution: "Dept. of Mechanical Engineering, Seoul National University",
      period: "Feb 2022-Jan 2024",
      advisor: {
        name: "Prof. Sangwook Park"
      },
      description:
        "Energy systems modeling and digital-twin analysis for decarbonization, electric vehicle integration, and renewable-hydrogen systems."
    }
  ],

  projects: [
    {
      icon: "👁️",
      title: "Deformation-Robust Optical Flow Pretraining",
      institution: "Robot Vision, Seoul National University",
      period: "Sep 2025-Dec 2025",
      description:
        "Course project with Jaeseung Kim on deformation-aware optical flow pretraining using deformed cost-volume autoencoding for greater robustness to non-rigid motion.",
      figure: "assets/img/projects/dmcva.png"
    },
    {
      id: "snusr-laos-project",
      icon: "🌱",
      title: "Information and Communication Technology Team Lead",
      institution: "Seoul National University Social Responsibility",
      period: "May 2023-Sep 2023",
      description:
        "Led an appropriate-technology project for rural agriculture in Laos, developing sensor-based and solar-powered smart chicken coops."
    }
  ],

  teaching: [
    {
      icon: "🧑‍🏫",
      title: "Lead Tutor",
      institution: "Exploring Computing: Applications in Everyday Life, Seoul National University",
      period: "Mar 2026-Present",
      description:
        "Course preparation, tutoring, quizzes, and project mentoring for an introductory computing course."
    },
    {
      icon: "🧑‍🏫",
      title: "Teaching Assistant",
      institution: "Introduction to Mechanical System Design and Robot Programming, Seoul National University",
      period: "Mar 2023-Jun 2023",
      description:
        "Supported an undergraduate course with instructional materials and hands-on tutorials in Python, ROS, and OpenCV."
    }
  ],

  education: [
    {
      icon: "🎓",
      title: "Seoul National University",
      institution: "Undergraduate Studies",
      period: "Mar 2021-Present",
      details: [
        "Mechanical Engineering",
        "Computer Science and Engineering",
        "Economics"
      ],
      note: "Expected graduation: Aug 2027"
    },
    {
      icon: "🏫",
      title: "Seoul Science High School",
      institution: "High School",
      period: "Mar 2018-Feb 2021"
    }
  ],

  awards: [
    {
      title: "Semiconductor Scholarship",
      issuer: "Seoul National University",
      year: "Aug 2025-Present"
    },
    {
      title: "Best Presentation Award",
      issuer: "International Conference on Energy, Aquatech and Sustainability (ICEAS)",
      year: "Aug 2024",
      details: [
        {
          text:
            "Awarded for “Smart Chicken Coops: Implementing Appropriate Technology for Rural Agriculture in Laos.”",
          mentions: [
            {
              label: "“Smart Chicken Coops: Implementing Appropriate Technology for Rural Agriculture in Laos”",
              href: "#snusr-laos-project"
            }
          ]
        }
      ]
    },
    {
      title: "Presidential Science Scholarship",
      year: "May 2023-Present"
    },
    {
      title: "Top Prize, Energy New Industry Theme Research Program",
      issuer: "Seoul National University Energy New Industry Convergence University Project",
      year: "Jan 2023",
      details: [
        "Awarded for research on a digital-twin-based smart grid linking renewable and hydrogen energy systems."
      ]
    }
  ],

  contact: [
    {
      label: "Email",
      value: "hsmail02@snu.ac.kr",
      mark: "✉️",
      url: "mailto:hsmail02@snu.ac.kr"
    },
    {
      label: "Google Scholar",
      mark: "📚",
      url: "https://scholar.google.com/citations?user=Gjaw-5oAAAAJ"
    },
    {
      label: "CV",
      mark: "📄",
      value: "Updated soon",
      url: null
    },
    {
      label: "GitHub",
      mark: "💻",
      url: "https://github.com/gohyunsu"
    },
    {
      label: "LinkedIn",
      mark: "🔗",
      url: "https://www.linkedin.com/in/hyunsu-go-650546348/"
    },
    {
      label: "Blog",
      mark: "📝",
      url: "https://blog.naver.com/hsmail02"
    },
    {
      label: "YouTube",
      mark: "📺",
      url: "https://www.youtube.com/@happyguma/"
    },
    {
      label: "Location",
      value: "Seoul, South Korea",
      mark: "📍",
      url: null
    }
  ],

  footer: "© 2026 Hyunsu Go"
};
