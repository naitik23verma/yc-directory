import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY=defineQuery(`*[_type=="startup" && defined(slug.current) &&  !defined($search) || category match $search || title match $search || author-> name match $search]  | order(_createdAt desc)
    {
  _id,
    title,
    slug,
    _createdAt,
    author->{
      _id,
      name,
      slug,
      image,
      bio,
    },
    views,
    description,
    category,
    image
}
`);


export const STARTUP_BY_ID_QUERY=defineQuery(`*[_type=="startup" && _id==$id][0]{
  _id,
    title,
    slug,
    _createdAt,
    author->{
      _id,
      name,
      username,
      slug,
      image,
      bio,
      pitch,
    },
    views,
    description,
    category,
    image
}`)

export const STARTUP_VIEWS_QUERY=defineQuery(`*[_type=="startup" && _id==$id][0]{
  _id,views
}
  `)

  export const AUTHOR_BY_GITHUB_ID_QUERY=defineQuery(`*[_type=="author" && id==$id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
    }`)