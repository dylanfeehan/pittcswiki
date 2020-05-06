import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../layout"
import Testimonial from "../testimonial"
import SEO from "../seo"
import { cleanCourseId, cleanCourseTitle } from "../../utils/course-namer"
import COURSE_INFO from "../../pages/courses/autogenerated_course_info.json"
import "../../styles/post.scss"

const REVIEW_FORM_LINK = "https://forms.gle/n5RVFe8HpgpEFJuWA"

const TestimonialList = ({ googleSheetData }) => {
  const testimonials = googleSheetData.edges.map((item, key) => (
    <Testimonial key={key} {...item.node} />
  ))
  return (
    <div>
      {testimonials}
      <p className="my-2">
        Add your review by filling out{" "}
        <a target="_blank" rel="noopener noreferrer" href={REVIEW_FORM_LINK}>
          this form!
        </a>
      </p>
    </div>
  )
}

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark, allGoogleSheetCourseTestimonials } = data
  const { frontmatter, html } = markdownRemark
  const modifiedTime = markdownRemark.parent.modifiedTime
  const courseTitle = cleanCourseTitle(frontmatter.title)
  const courseId = frontmatter.id
  // TODO, make the autogenerated create a hash map instead of a list. We can
  // also add a pipeline, where it scrapes, creates the list based on category,
  // and parses the preqreqs with the peg js parser
  const courseData = COURSE_INFO.courses.filter(({ id }) => id === courseId)[0]
  return (
    <Layout>
      <SEO title={courseId + " - " + frontmatter.title} />
      <div className="blog-post-container">
        <div className="blog-post">
          <div className="frontmatter">
            <h1 className="title">{cleanCourseId(courseId)}</h1>
            <h2 className="sub-title">{courseTitle}</h2>
            <i className="date">Last updated on {modifiedTime}</i>
          </div>
          <div className="mb-4">
            <span>
              <a
                href={courseData.sci_href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link to SCI Course Page
              </a>
            </span>
          </div>
          <div className="mb-4">
            <span className="label">Requirements</span>
            <span>{courseData.requirements}</span>
          </div>
          <div className="mb-4">
            <span className="label">Course Description</span>
            <span>{courseData.description}</span>
          </div>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <h2>Testimonials</h2>
          <div className="mb-4">
            <TestimonialList
              googleSheetData={allGoogleSheetCourseTestimonials}
            />
          </div>
          <Link to="/">Back to Homepage</Link>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!, $courseId: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
        id
      }
      parent {
        ... on File {
          modifiedTime(formatString: "MMMM Do YYYY")
        }
      }
    }
    allGoogleSheetCourseTestimonials(filter: { courseId: { eq: $courseId } }) {
      edges {
        node {
          courseId
          review
          difficulty
          quality
          prof
          term
          year
        }
      }
    }
  }
`
