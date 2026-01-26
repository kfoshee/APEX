import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://apexdegree.com"),
  title: {
    default: "APEX | Get Hired for What You Can Do - Portfolio-Based Career Credential",
    template: "%s | APEX"
  },
  description: "Skip the traditional degree. Build a verified portfolio employers can actually evaluate. Learn Data Analytics, Product Management, and Engineering through real-world challenges. Get hired based on proven skills, not just credentials. $500/month for 24 months.",
  keywords: [
    "APEX degree",
    "portfolio-based learning",
    "career credential",
    "data analytics course",
    "product management training",
    "software engineering bootcamp",
    "alternative to college",
    "skills-based hiring",
    "verified portfolio",
    "job-ready skills",
    "career change",
    "tech career",
    "online education",
    "practical learning",
    "employer-ready portfolio",
    "coding bootcamp alternative",
    "learn data analytics",
    "get hired without degree"
  ],
  authors: [{ name: "APEX" }],
  creator: "APEX",
  publisher: "APEX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apexdegree.com",
    siteName: "APEX",
    title: "APEX | Get Hired for What You Can Do",
    description: "Skip the traditional degree. Build a verified portfolio employers can actually evaluate. Learn through real-world challenges and get hired based on proven skills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "APEX - Portfolio-Based Career Credential",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "APEX | Get Hired for What You Can Do",
    description: "Skip the traditional degree. Build a verified portfolio employers can actually evaluate.",
    images: ["/og-image.png"],
    creator: "@apexdegree",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://apexdegree.com",
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "APEX",
    url: "https://apexdegree.com",
    logo: "https://apexdegree.com/APEX-Final-White.svg",
    description: "APEX is a portfolio-based career credential that helps you get hired for what you can do.",
    offers: {
      "@type": "Offer",
      name: "APEX Degree Program",
      price: "500",
      priceCurrency: "USD",
      description: "24-month portfolio-based credential program.",
      availability: "https://schema.org/LimitedAvailability"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is the APEX degree accredited?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "APEX is a new kind of credential built on proof of work. Employers can see exactly what you're capable of through your portfolio."
        }
      },
      {
        "@type": "Question",
        name: "Can I use AI tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Use whatever tools help you do great work. But you defend everything in a live session—if you can't explain your approach, you don't pass."
        }
      },
      {
        "@type": "Question",
        name: "What's the time commitment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Plan for 10-15 hours per week over 2 years."
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}