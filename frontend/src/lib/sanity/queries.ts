import { groq } from 'next-sanity';

export const allProjectsQuery = groq`
  *[_type == "project"] | order(featured desc, year desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    client,
    industry,
    shortDescription,
    headline,
    overview,
    summary,
    challenge,
    strategy,
    "services": coalesce(services, servicesRendered, []),
    "deliverables": coalesce(deliverables, scope, []),
    year,
    honestyNote,
    featured,
    logo,
    "cover": coalesce(cover, coverImage),
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
    shortDescription,
    headline,
    overview,
    summary,
    challenge,
    strategy,
    "services": coalesce(services, servicesRendered, []),
    "deliverables": coalesce(deliverables, scope, []),
    year,
    honestyNote,
    featured,
    logo,
    "cover": coalesce(cover, coverImage),
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
  *[_type == "post"] | order(publishedAt desc) {
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

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    agencyName,
    tagline,
    contactEmail,
    phone,
    address
  }
`;
