import { groq } from 'next-sanity';

export const allProjectsQuery = groq`
  *[_type == "project"] | order(featured desc, year desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    client,
    industry,
    categories,
    transformationSummary,
    shortDescription,
    headline,
    overview,
    summary,
    challenge,
    goal,
    engagementRole,
    servicesDelivered[] {
      service,
      note
    },
    scopeTags,
    "services": coalesce(services, servicesRendered, []),
    "deliverables": coalesce(deliverables, scope, []),
    year,
    honestyNote,
    featured,
    logo,
    "cover": coalesce(cover, coverImage),
    phaseBrand {
      enabled,
      title,
      description,
      layoutStyle,
      deliverables,
      images[] {
        "image": image,
        alt,
        caption
      }
    },
    phaseDigital {
      enabled,
      title,
      description,
      websiteUrl,
      techStack,
      uxUiNotes,
      layoutStyle,
      screenshots[] {
        "image": image,
        alt,
        caption
      }
    },
    phaseGrowth {
      enabled,
      title,
      description,
      channels,
      seoImprovements,
      layoutStyle,
      creativeAssets[] {
        "image": image,
        alt,
        caption
      }
    },
    result {
      outcomeSummary,
      keyWins,
      metrics[] {
        label,
        value,
        verified,
        permission
      },
      testimonial {
        quote,
        author,
        title,
        company,
        avatar
      }
    },
    outcomes[] {
      label,
      value,
      verified,
      permission
    },
    gallery[] {
      "image": image,
      alt,
      caption
    }
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    industry,
    categories,
    transformationSummary,
    shortDescription,
    headline,
    overview,
    summary,
    challenge,
    goal,
    engagementRole,
    servicesDelivered[] {
      service,
      note
    },
    scopeTags,
    "services": coalesce(services, servicesRendered, []),
    "deliverables": coalesce(deliverables, scope, []),
    year,
    honestyNote,
    featured,
    logo,
    "cover": coalesce(cover, coverImage),
    phaseBrand {
      enabled,
      title,
      description,
      layoutStyle,
      deliverables,
      images[] {
        "image": image,
        alt,
        caption
      }
    },
    phaseDigital {
      enabled,
      title,
      description,
      websiteUrl,
      techStack,
      uxUiNotes,
      layoutStyle,
      screenshots[] {
        "image": image,
        alt,
        caption
      }
    },
    phaseGrowth {
      enabled,
      title,
      description,
      channels,
      seoImprovements,
      layoutStyle,
      creativeAssets[] {
        "image": image,
        alt,
        caption
      }
    },
    result {
      outcomeSummary,
      keyWins,
      metrics[] {
        label,
        value,
        verified,
        permission
      },
      testimonial {
        quote,
        author,
        title,
        company,
        avatar
      }
    },
    outcomes[] {
      label,
      value,
      verified,
      permission
    },
    gallery[] {
      "image": image,
      alt,
      caption
    }
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readingTime,
    coverImage,
    category-> {
      title,
      "slug": slug.current
    },
    author-> {
      name,
      role,
      image
    }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishedAt,
    readingTime,
    coverImage,
    category-> {
      title,
      "slug": slug.current
    },
    author-> {
      name,
      role,
      image
    }
  }
`;

export const allTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc, name asc) {
    _id,
    name,
    role,
    bio,
    image,
    linkedIn,
    twitter,
    skills,
    order
  }
`;

export const allJobOpeningsQuery = groq`
  *[_type == "jobOpening" && active == true] | order(order asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    department,
    location,
    type,
    experienceLevel,
    overview,
    responsibilities,
    requirements,
    niceToHave,
    benefits,
    applyUrl,
    active,
    order
  }
`;

export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(featured desc, order asc, _createdAt desc) {
    _id,
    quote,
    author,
    title,
    company,
    avatar,
    logo,
    verified,
    rating,
    metricHighlight,
    featured,
    order
  }
`;

export const allCreativeShowcasesQuery = groq`
  *[_type == "creativeShowcase"] | order(featured desc, order asc, _createdAt desc) {
    _id,
    title,
    subtitle,
    category,
    mediaType,
    image,
    videoUrl,
    stats,
    aspectRatio,
    featured,
    order
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName,
    siteDescription,
    contactEmail,
    primaryPhoneNumber,
    address,
    socialProfiles,
    primaryCtaLabel,
    primaryCtaUrl,
    enableCaseStudyMetrics
  }
`;
