import {Link} from 'react-router-dom'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="job-item-link">
      <li className="job-item">
        <div className="company-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="star-icon" />
              <p className="rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-package-container">
          <div className="location-type-container">
            <div className="location-container">
              <MdLocationOn />
              <p className="location-text">{location}</p>
            </div>
            <div className="employment-type-container">
              <BsBriefcaseFill />
              <p className="employment-type-text">{employmentType}</p>
            </div>
          </div>
          <p className="package-text">{packagePerAnnum}</p>
        </div>
        <hr className="separator" />
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
