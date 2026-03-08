import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your .env.local file.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const homepageContent = {
  hero: {
    badge: {
      label: "NEW",
      text: "🎓 AYii University: Academic Hub",
    },
    heading: {
      line1: "AYii University",
      line2: "Learning Hub",
    },
    subheading:
      "Find past papers, lecture notes, videos — and get your questions answered by peers and lecturers at AYii University.",
    buttons: {
      primary: {
        text: "ENROLL NOW",
        href: "/courses",
      },
      secondary: {
        text: "Launch LMS",
        href: "/dashboard",
      },
    },
    stats: [
      {
        id: "stat_students",
        value: "3K+",
        label: "Students",
      },
      {
        id: "stat_faculties",
        value: "12+",
        label: "Faculties",
      },
      {
        id: "stat_resources",
        value: "500+",
        label: "Resources",
      },
    ],
    chatUI: {
      userAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      aiAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      messages: [
        {
          id: 1,
          type: "ai",
          text: "Hi! Ready to boost your semester grades? 🎓",
        },
        {
          id: 2,
          type: "user",
          text: "Yes, how do I find past papers?",
        },
        {
          id: 3,
          type: "ai",
          text: "I can help with that! Found 15+ verified papers for you.",
          button: {
            text: "View Resources",
          },
        },
      ],
    },
  },
  animatedStatistics: {
    stats: [
      {
        id: "stat_students",
        value: 3000,
        label: "Students",
        suffix: "+",
      },
      {
        id: "stat_resources",
        value: 500,
        label: "Resources",
        suffix: "+",
      },
      {
        id: "stat_questions",
        value: 200,
        label: "Questions Answered",
        suffix: "+",
      },
    ],
  },
  learningFeatures: {
    heading: "Everything you need to succeed",
    subheading:
      "AYii University provides a centralized hub for all your academic needs.",
    features: [
      {
        id: "feature_resources",
        icon: "FileText",
        title: "Resources",
        description:
          "Access past papers, lecture notes, and videos tailored for your specific course units.",
      },
      {
        id: "feature_forum",
        icon: "MessageSquare",
        title: "Q&A Forum",
        description:
          "Ask questions and get verified answers from your peers and lecturers across departments.",
      },
      {
        id: "feature_quizzes",
        icon: "Brain",
        title: "Quizzes",
        description:
          "Test your knowledge with unit-specific quizzes designed by lecturers to help you prepare.",
      },
      {
        id: "feature_announcements",
        icon: "Bell",
        title: "Announcements",
        description:
          "Stay updated with important campus events, course changes, and university news.",
      },
    ],
  },
  howItWorks: {
    heading: "Get started in 3 simple steps",
    subheading: "Join the community and start improving your grades today.",
    steps: [
      {
        id: "step_register",
        number: "01",
        title: "Register",
        description:
          "Create your account with AYii University and course details to get personalized content.",
      },
      {
        id: "step_browse",
        number: "02",
        title: "Browse",
        description:
          "Find resources, join discussions, and take quizzes specifically for your course units.",
      },
      {
        id: "step_learn",
        number: "03",
        title: "Learn",
        description:
          "Download materials, get answers from lecturers, and ace your exams with confidence.",
      },
    ],
  },
  faqSection: {
    heading: "Got Questions?",
    subheading:
      "Everything you need to know about navigating the AYii University platform.",
    faqs: [
      {
        id: "faq_past_papers",
        question: "How do I access past papers and lecture notes?",
        answer:
          "Once you're logged in, navigate to the 'Resources' section. You can use the search bar to filter by course unit name or code. All materials are categorized by year and semester for easy access.",
      },
      {
        id: "faq_uploads",
        question: "Who can upload resources to AYii University?",
        answer:
          "Currently, only Lecturers and Admins can upload verified resources like lecture notes. However, students can contribute through the Q&A Forum and share study tips. Student uploads will be available in the next update.",
      },
      {
        id: "faq_free",
        question: "Is the platform free to use for all AYii students?",
        answer:
          "Yes, AYii University is a free resource developed for the students. You only need your university email or student details to register.",
      },
      {
        id: "faq_mobile",
        question: "Can I take quizzes on my mobile phone?",
        answer:
          "Absolutely! AYii University is fully responsive and works perfectly on smartphones. While we don't have a native app yet, the web experience is optimized for mobile study sessions.",
      },
      {
        id: "faq_report",
        question: "How do I report an error in a resource?",
        answer:
          "If you find an error in a quiz or lecture note, please use the 'Report' flag within that specific resource, or start a discussion in the 'Community' section. Our moderators will review it promptly.",
      },
    ],
  },
};

async function seedCmsContent() {
  console.log("🌱 Seeding CMS content...");

  for (const [section, content] of Object.entries(homepageContent)) {
    await prisma.cmsContent.upsert({
      where: {
        page_section: {
          page: "homepage",
          section: section,
        },
      },
      update: {
        content: content,
      },
      create: {
        page: "homepage",
        section: section,
        content: content,
      },
    });
    console.log(`✅ Seeded homepage/${section}`);
  }

  console.log("✨ CMS content seeding complete!");
}

seedCmsContent()
  .catch((e) => {
    console.error("❌ Error seeding CMS content:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
